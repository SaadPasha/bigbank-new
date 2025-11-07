// src/api/loan-data.factory.ts
import {faker} from '@faker-js/faker';

export type LoanCalculatorRequest = {
    currency?: 'EUR';
    productType: string;
    maturity: number;             // months
    administrationFee: number;
    conclusionFee: number;
    amount: number;
    monthlyPaymentDay: number;    // 1..31
    interestRate?: number;        // option A
    interestFromLoanSum?: number; // option B
};

type BuildOptions = {
    variant?: 'rate' | 'sum'; // choose which "oneOf" branch to satisfy
};

export function buildLoanRequest(
    overrides: Partial<LoanCalculatorRequest> = {},
    options: BuildOptions = {variant: 'rate'}): LoanCalculatorRequest {
    const base: LoanCalculatorRequest = {
        currency: 'EUR',
        productType: overrides.productType ?? faker.helpers.arrayElement(['SMALL_LOAN', 'CONSUMER_LOAN', 'CAR_LOAN']),
        maturity: overrides.maturity ?? faker.number.int({min: 6, max: 84}),
        administrationFee: overrides.administrationFee ?? faker.number.float({min: 0, max: 200, fractionDigits: 2}),
        conclusionFee: overrides.conclusionFee ?? faker.number.float({min: 0, max: 300, fractionDigits: 2}),
        amount: overrides.amount ?? faker.number.float({min: 100, max: 20000, fractionDigits: 2}),
        monthlyPaymentDay: overrides.monthlyPaymentDay ?? faker.number.int({min: 1, max: 28}), // avoid 29–31 edge cases
    };

    if (options.variant === 'sum') {
        return {
            ...base,
            interestFromLoanSum:
                overrides.interestFromLoanSum ??
                faker.number.float({min: 0.5, max: 25.5, fractionDigits: 2}), // 1–30% of sum (example)
        };
    }

    // default to interestRate branch
    return {
        ...base,
        interestRate:
            overrides.interestRate ??
            faker.number.float({min: 0.01, max: 0.3, fractionDigits: 4}), // 1–30% nominal (example)
    };
}
