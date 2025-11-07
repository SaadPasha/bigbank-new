import { test as base } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { LoanApi } from './calculateClient';
import { buildLoanRequest } from "./calculateData.factory";
import {loanCalculatorRequestSchema, loanCalculateValidResponseSchema, loanCalculatorBadRequestSchema, loanCalculatorServerErrorSchema} from "./calculate.schema";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateRequest = ajv.compile(loanCalculatorRequestSchema);
const validateValidResponse = ajv.compile(loanCalculateValidResponseSchema);
const validateBadResponse = ajv.compile(loanCalculatorBadRequestSchema);
const validateServerError= ajv.compile(loanCalculatorServerErrorSchema);

type ApiFixtures = {
    loanApi: LoanApi;
    buildLoanRequest: typeof buildLoanRequest;
    validateRequest: typeof validateRequest;
    validateValidResponse: typeof validateValidResponse;
    validateBadResponse: typeof validateBadResponse;
    validateServerErrorResponse: typeof validateServerError;
};

export const test = base.extend<ApiFixtures>({
    loanApi: async ({ request }, use) => {
        const api = new LoanApi(request);
        await use(api);
    },

    buildLoanRequest: async ({}, use) => {
        await use(buildLoanRequest);
    },

    validateRequest: async ({}, use) => {
        await use(validateRequest);
    },

    validateValidResponse: async ({}, use) => {
        await use(validateValidResponse);
    },

    validateBadResponse: async ({}, use) => {
        await use(validateBadResponse);
    },

    validateServerErrorResponse: async ({}, use) => {
        await use(validateServerError);
    }

});

export const expect = test.expect;
