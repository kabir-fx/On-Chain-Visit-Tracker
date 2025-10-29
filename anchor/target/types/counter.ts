/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/counter.json`.
 */
export type Counter = {
  "address": "4iTkCvhwbbYUvobnobkFN3LkDRiZm1yZoCtvTD2wsKnG",
  "metadata": {
    "name": "counter",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "docs": [
    "Main program module containing all instruction handlers",
    "",
    "This module defines the business logic for the user visit counter.",
    "It provides two main operations: initializing the global counter and",
    "recording user visits."
  ],
  "instructions": [
    {
      "name": "initializeCounter",
      "docs": [
        "Initialize the global visit counter",
        "",
        "This instruction must be called once to create the global counter account.",
        "It sets up the PDA that will store the total number of unique visits.",
        "",
        "# Arguments",
        "* `ctx` - The instruction context containing accounts and program state",
        "",
        "# Accounts Required",
        "* `payer` - The account paying for account creation (must be signer)",
        "* `counter` - The global counter PDA (will be created)",
        "* `system_program` - Required for account creation",
        "",
        "# Returns",
        "* `Result<()>` - Success or an error if initialization fails",
        "",
        "# Security",
        "- Only one global counter can exist due to PDA seed constraints",
        "- Payer must sign the transaction"
      ],
      "discriminator": [
        67,
        89,
        100,
        87,
        231,
        172,
        35,
        124
      ],
      "accounts": [
        {
          "name": "payer",
          "docs": [
            "The account that will pay for creating the counter account",
            "Must be a signer to authorize the transaction"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "docs": [
            "The global counter account that will store the total visit count",
            "",
            "# PDA Details",
            "- Seeds: `[\"counter\"]`",
            "- Created with `init` constraint (fails if account already exists)",
            "- Bump seed stored in the account for future reference",
            "- Space allocated: 8 (discriminator) + Counter::INIT_SPACE"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program",
            "Required for creating new accounts on the blockchain"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "markUserVisit",
      "docs": [
        "Record a user's visit to the website",
        "",
        "This instruction allows a user to record their website visit by incrementing",
        "the global counter. Each wallet address can only call this once due to",
        "the unique UserVisit PDA constraint.",
        "",
        "# Arguments",
        "* `ctx` - The instruction context containing accounts and program state",
        "",
        "# Accounts Required",
        "* `user` - The visitor's wallet (must be signer)",
        "* `counter` - The global counter PDA (will be incremented)",
        "* `user_visit` - The user's visit tracking PDA (will be created/updated)",
        "* `system_program` - Required for account creation",
        "",
        "# Returns",
        "* `Result<()>` - Success or AlreadyVisited error",
        "",
        "# Security",
        "- Prevents duplicate visits from same wallet",
        "- Uses checked arithmetic to prevent overflow",
        "- Validates PDA ownership and seeds"
      ],
      "discriminator": [
        235,
        35,
        156,
        205,
        98,
        48,
        131,
        180
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "The wallet address of the user recording their visit",
            "Must be a signer to prove ownership and prevent spoofing"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "docs": [
            "The global counter account that tracks total unique visits",
            "",
            "# PDA Verification",
            "- Seeds: `[\"counter\"]`",
            "- Must exist (created by initialize instruction)",
            "- Bump verified against stored value for security"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "userVisit",
          "docs": [
            "The user-specific visit tracking account",
            "",
            "# PDA Details",
            "- Seeds: `[\"user_visit\", user_pubkey]`",
            "- Created per user to track their visit status",
            "- `init_if_needed` allows first-time creation but reuses existing accounts",
            "- Prevents duplicate visits from same wallet"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  118,
                  105,
                  115,
                  105,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "The Solana System Program",
            "Required for creating new user visit accounts"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "discriminator": [
        255,
        176,
        4,
        245,
        188,
        253,
        124,
        25
      ]
    },
    {
      "name": "userVisit",
      "discriminator": [
        228,
        199,
        36,
        45,
        194,
        225,
        235,
        88
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyVisited",
      "msg": "User has already visited - each wallet can only record one visit"
    },
    {
      "code": 6001,
      "name": "incrementFailed",
      "msg": "Failed to increment the global visit count - counter overflow"
    }
  ],
  "types": [
    {
      "name": "counter",
      "docs": [
        "The global counter account data structure",
        "",
        "This account stores the total number of unique website visits.",
        "It's a single, program-owned account that serves as the source of truth",
        "for visit metrics."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "docs": [
              "Total number of unique visits recorded",
              "Uses u64 to support large numbers (up to ~18 quintillion)"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA address derivation",
              "Stored to enable future PDA address recreation",
              "Range: 0-255"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userVisit",
      "docs": [
        "User-specific visit tracking account data structure",
        "",
        "Each wallet gets one of these accounts to track whether",
        "they have visited the website. This prevents duplicated visit counting."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "The wallet address of the user",
              "Stored for verification and potential analytics"
            ],
            "type": "pubkey"
          },
          {
            "name": "hasVisited",
            "docs": [
              "Boolean flag indicating if this user has visited",
              "Once set to true, cannot be changed (prevents duplicates)"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for this user's PDA",
              "Allows deterministic address creation using this user's tracking account"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
