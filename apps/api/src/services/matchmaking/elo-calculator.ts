export interface EloUpdate {
    userId: string;
    currentRating: number;
    newRating: number;
    change: number;
}

export class EloCalculator {
    private K_FACTOR = 32;

    calculateExpected(ratingA: number, ratingB: number): number {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    calculateNewRating(currentRating: number, opponentRating: number, actualScore: number): number {
        const expected = this.calculateExpected(currentRating, opponentRating);
        const change = this.K_FACTOR * (actualScore - expected);
        return Math.round(currentRating + change);
    }

    processMatchResult(
        winner: { userId: string; rating: number },
        loser: { userId: string; rating: number },
        isDraw: boolean = false
    ): [EloUpdate, EloUpdate] {
        const winnerScore = isDraw ? 0.5 : 1;
        const loserScore = isDraw ? 0.5 : 0;

        const winnerNew = this.calculateNewRating(winner.rating, loser.rating, winnerScore);
        const loserNew = this.calculateNewRating(loser.rating, winner.rating, loserScore);

        return [
            {
                userId: winner.userId,
                currentRating: winner.rating,
                newRating: winnerNew,
                change: winnerNew - winner.rating,
            },
            {
                userId: loser.userId,
                currentRating: loser.rating,
                newRating: loserNew,
                change: loserNew - loser.rating,
            },
        ];
    }
}
