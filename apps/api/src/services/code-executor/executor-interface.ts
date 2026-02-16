export interface ExecutionRequest {
    code: string;
    language: 'python' | 'javascript' | 'java' | 'cpp' | 'go';
    testCases: {
        input: string;
        expectedOutput: string;
    }[];
    timeLimit: number;
    memoryLimit: number;
}

export interface TestResult {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    executionTime: number;
    memory: number;
    error?: string;
}

export interface ExecutionResult {
    success: boolean;
    testResults: TestResult[];
    totalPassed: number;
    totalTests: number;
    overallExecutionTime: number;
    complexity?: string;
}

export interface ICodeExecutor {
    execute(req: ExecutionRequest): Promise<ExecutionResult>;
}
