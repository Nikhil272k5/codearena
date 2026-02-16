import { ICodeExecutor, ExecutionRequest, ExecutionResult, TestResult } from './executor-interface';
import { logger } from '../../utils/logger';
import { exec } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const LANGUAGE_CONFIG: Record<string, { ext: string; cmd: (file: string) => string }> = {
    python: { ext: 'py', cmd: (f) => `python3 "${f}"` },
    javascript: { ext: 'js', cmd: (f) => `node "${f}"` },
    java: { ext: 'java', cmd: (f) => `javac "${f}" && java -cp "${join(f, '..')}" Main` },
    cpp: { ext: 'cpp', cmd: (f) => `g++ -o "${f}.out" "${f}" && "${f}.out"` },
    go: { ext: 'go', cmd: (f) => `go run "${f}"` },
};

export class DockerExecutor implements ICodeExecutor {
    private sandboxDir: string;

    constructor() {
        this.sandboxDir = join(process.cwd(), 'tmp', 'sandbox');
        if (!existsSync(this.sandboxDir)) {
            mkdirSync(this.sandboxDir, { recursive: true });
        }
    }

    async execute(req: ExecutionRequest): Promise<ExecutionResult> {
        const sessionId = uuidv4();
        const sessionDir = join(this.sandboxDir, sessionId);
        mkdirSync(sessionDir, { recursive: true });

        const config = LANGUAGE_CONFIG[req.language];
        if (!config) {
            return {
                success: false,
                testResults: [],
                totalPassed: 0,
                totalTests: req.testCases.length,
                overallExecutionTime: 0,
                complexity: undefined,
            };
        }

        const fileName = req.language === 'java' ? 'Main' : 'solution';
        const filePath = join(sessionDir, `${fileName}.${config.ext}`);
        writeFileSync(filePath, req.code);

        const testResults: TestResult[] = [];
        let totalPassed = 0;
        const startTime = Date.now();

        for (const testCase of req.testCases) {
            const result = await this.runTestCase(config.cmd(filePath), testCase.input, testCase.expectedOutput, req.timeLimit);
            testResults.push(result);
            if (result.passed) totalPassed++;
        }

        const overallExecutionTime = Date.now() - startTime;

        // Cleanup
        try {
            rmSync(sessionDir, { recursive: true, force: true });
        } catch (e) {
            logger.warn('Failed to cleanup sandbox', { sessionId });
        }

        const complexity = this.estimateComplexity(req.code);

        return {
            success: totalPassed === req.testCases.length,
            testResults,
            totalPassed,
            totalTests: req.testCases.length,
            overallExecutionTime,
            complexity,
        };
    }

    private runTestCase(
        command: string,
        input: string,
        expectedOutput: string,
        timeLimit: number
    ): Promise<TestResult> {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const child = exec(command, { timeout: timeLimit, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
                const executionTime = Date.now() - startTime;
                const actualOutput = stdout.trim();
                const expected = expectedOutput.trim();

                if (error) {
                    resolve({
                        passed: false,
                        input,
                        expectedOutput: expected,
                        actualOutput: stderr || error.message,
                        executionTime,
                        memory: 0,
                        error: error.killed ? 'Time Limit Exceeded' : stderr || error.message,
                    });
                    return;
                }

                resolve({
                    passed: actualOutput === expected,
                    input,
                    expectedOutput: expected,
                    actualOutput,
                    executionTime,
                    memory: 0,
                });
            });

            // Send input via stdin
            if (input && child.stdin) {
                child.stdin.write(input);
                child.stdin.end();
            }
        });
    }

    private estimateComplexity(code: string): string {
        const lines = code.split('\n');
        let maxNestingDepth = 0;
        let currentDepth = 0;
        let hasRecursion = false;

        for (const line of lines) {
            const trimmed = line.trim();
            if (/\b(for|while)\b/.test(trimmed)) {
                currentDepth++;
                maxNestingDepth = Math.max(maxNestingDepth, currentDepth);
            }
            if (/^}/.test(trimmed) || /^\s*$/.test(trimmed)) {
                currentDepth = Math.max(0, currentDepth - 1);
            }
            if (/\bdef\b.*\(.*\).*:/.test(trimmed) || /function\b/.test(trimmed)) {
                const funcName = trimmed.match(/(?:def|function)\s+(\w+)/)?.[1];
                if (funcName && code.includes(funcName + '(') && code.split(funcName).length > 2) {
                    hasRecursion = true;
                }
            }
        }

        if (hasRecursion && maxNestingDepth > 0) return 'O(2^n)';
        if (hasRecursion) return 'O(n log n)';
        if (maxNestingDepth >= 3) return 'O(n³)';
        if (maxNestingDepth === 2) return 'O(n²)';
        if (maxNestingDepth === 1) return 'O(n)';
        return 'O(1)';
    }
}
