// Request body 'Base' schema - As the API req has a 'oneOf' implemenation
// for the 'interestRate' and 'interestFromLoanSum'
const base = {
    type: "object",
    additionalProperties: false,
    properties: {
        currency: { type: "string", enum: ["EUR"] },
        productType: { type: "string" },
        maturity: { type: "integer", minimum: 1 },
        administrationFee: { type: "number" },
        conclusionFee: { type: "number" },
        amount: { type: "number", minimum: 1 },
        monthlyPaymentDay: { type: "integer", minimum: 1, maximum: 31 },
        interestRate: { type: "number" },
        interestFromLoanSum: { type: "number" }

    }
}

export const loanCalculatorRequestSchema = {
    oneOf: [
        {
            ...base,
            required: [
                "productType",
                "maturity",
                "administrationFee",
                "conclusionFee",
                "amount",
                "monthlyPaymentDay",
                "interestRate",
            ]
        },
        {
            ...base,
            required: [
                "productType",
                "maturity",
                "administrationFee",
                "conclusionFee",
                "amount",
                "monthlyPaymentDay",
                "interestFromLoanSum",
            ]
        }
    ]
}

// Response body schema - Valid request
export const loanCalculateValidResponseSchema = {
    type: "object",
    additionalProperties: false,
    required: ["totalRepayableAmount", "monthlyPayment", "apr"],
    properties: {
        totalRepayableAmount: { type: "number" },
        monthlyPayment: { type: "number" },
        apr: { type: "number" }
    }
} as const;

// Error body schema - Bad Request
export const loanCalculatorBadRequestSchema = {
    type: "array",
    items: {
        type: "object",
        additionalProperties: true,
        required: ["keyword", "dataPath", "schemaPath", "message", "params"],
        properties: {
            keyword: { type: "string" },                // e.g. "required", "oneOf"
            dataPath: { type: "string" },               // e.g. ""
            schemaPath: { type: "string" },             // e.g. "#/oneOf/0/required"
            message: { type: "string" },                // e.g. "should have required property 'maturity'"
            params: {
                type: "object",
                additionalProperties: true,
                properties: {
                    missingProperty: { type: "string" },    // when keyword === "required"
                    passingSchemas: {                       // when keyword === "oneOf"
                        anyOf: [{ type: "null" }, { type: "array", items: { type: "integer" } }]
                    }
                }
            }
        }
    }
} as const;

// Error body schema - Server Error
export const loanCalculatorServerErrorSchema = {
    type: "object",
    additionalProperties: false,
    required: ["error"],
    properties: {
        error: {
            type: "object",
            additionalProperties: false,
            required: ["code", "message"],
            properties: {
                code: { type: "integer", enum: [500] },
                message: { type: "string" }
            }
        }
    }
}