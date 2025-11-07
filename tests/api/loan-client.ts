import type { APIRequestContext } from '@playwright/test';
import type { LoanCalculatorRequest } from './loan-data.factory';

export class LoanApi {
    public loanUrl: string;
    constructor(private readonly request: APIRequestContext) {
        this.loanUrl = '/api/v1/loan/calculate';
    }

    async calculate(body: LoanCalculatorRequest, endpoint?: string) {
        const path: string = endpoint ?? this.loanUrl;
        return this.request.post(path, { data: body });
    }
}
