import { test, expect } from "../apiFixtures";
import playwrightConfig from "../../../playwright.config";

test.describe("API Schema validation tests", async () => {
    let responseBody: object = {};
    test("Loan Calculator - Valid Request and Response ", async ({
        loanApi,
        buildLoanRequest,
        validateRequest,
        validateValidResponse
    }) => {
        const body = buildLoanRequest({productType: "SMALL_LOAN_EE01"}, {variant:'rate'});
        await test.step(`Validate the Request Schema - Consumer/Client side contract`, async () => {
            expect(validateRequest(body)).toBe(true);
        });

        await test.step("Send the API req to the endpoint", async () => {
            const resp = await loanApi.calculate(body);
            expect(resp.status()).toBe(200);
            responseBody = await resp.json();
        })

        await test.step("Validate the Valid Response Schema - Provider/Server side contract", async () => {
            expect(validateValidResponse(responseBody)).toBe(true);
        })
    });

    test("Loan Calculator - 400 Error Response ", async ({
        loanApi,
        buildLoanRequest,
        validateBadResponse}) => {

        const body = buildLoanRequest({}, {variant:'rate'});

        // This is an intentional modification of the req body to poke server for handling bad requests
        const invalidBody = {...body, productType: 123} as unknown;

        await test.step("Send the API req to the endpoint", async () => {
            const resp = await loanApi.calculate(invalidBody as any);
            expect(resp.status()).toBe(400);
            responseBody = await resp.json();
        })

        await test.step("Validate the Bad Response Schema - Provider/Server side contract", async () => {
            expect(validateBadResponse(responseBody)).toBe(true);
        });
    });

    test("Loan Calculator - 500 Error Response ", async ({
        loanApi,
        buildLoanRequest,
        validateServerErrorResponse
    }) => {

        const serverErrorReqBody = buildLoanRequest({productType: "SMALL_LOAN_EE011"}, {variant:'rate'});

        await test.step("Send the API req to the endpoint", async () => {
            const resp = await loanApi.calculate(serverErrorReqBody);
            expect(resp.status()).toBe(500);
            responseBody = await resp.json();
        });

        await test.step("Validate the Internal Server Error response - Provider/Server side contract", async () => {
            expect(validateServerErrorResponse(responseBody)).toBe(true);
        });
    });
})