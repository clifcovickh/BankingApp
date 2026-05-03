# Bank Saving System

## Tech Stack
- **Frontend:** React (Mobile-first approach)
- **Backend:** Node.js (MVC Architecture)
- **Validation:** Zod (Schema-based validation)
- **Database:** PostgreSQL (Relational data & ACID compliance)
- **API Testing:** Postman 
- **API Documentation:** Swagger
- **Version Control:** GitLab

---

## System Architecture

### Database Schema 
The system uses a relational PostgreSQL structure to ensure data integrity:
- `customer`: Stores basic user identity.
- `deposito_type`: Reference table for interest rates (Bronze, Silver, Gold, and/or future deposito types).
- `account`: Links customers to a specific deposit plan, also holds the current balance.
- `transaction`: Immutable log of all `DEPOSIT` and `WITHDRAW` actions.
- `request`: Stores user request for account/customer deletion.

### Use Case Diagram
- **Customer:** Can open accounts, deposit funds, and withdraw funds with automated interest calculation, and request account/customer deletion.
- **Admin:** Manage customer records and adjust interest rates in the `deposito_types` table, edit/delete customer and accounts, approve requests.

---

## Error Handling & Edge Cases 

### 1. Technical Validation (Zod Schema)
| Scenario | Action | HTTP Code |
| :--- | :--- | :--- |
| **Negative Amount** | Block deposits/withdrawals where amount <= 0. | `400 Bad Request` |
| **Invalid Data Type** | Zod catches non-numeric inputs for balances or IDs. | `400 Bad Request` |
| **Missing Fields** | Required fields (e.g., `account_id`) must be present. | `400 Bad Request` |

### 2. Financial & Business Logic
| Scenario | Action | HTTP Code |
| :--- | :--- | :--- |
| **Insufficient Funds** | Attempting to withdraw more than `Balance + Interest`. | `422 Unprocessable Entity` |
| **Invalid Date Sequence** | Withdrawal date is earlier than the Deposit date. | `400 Bad Request` |
| **Future Dating** | Transactions cannot be logged with a future timestamp. | `400 Bad Request` |
| **Empty Account** | Attempting a withdrawal from an account with 0 balance. | `400 Bad Request` |

### 3. Relational Integrity
| Scenario | Action | HTTP Code |
| :--- | :--- | :--- |
| **Active Balance Deletion** | Cannot delete a customer with a non-zero balance. | `409 Conflict` |
| **Orphaned Account** | Cannot create an account for a non-existent Customer ID. | `404 Not Found` |

---

## Interest Calculation Logic
The system calculates interest at the moment of withdrawal using the following formula:

`Monthly Return = Yearly Return / 12`
`Ending Balance = Starting Balance + (Starting Balance * #Months * Monthly Return)`

**Edge Case Handling:**
- **Zero Months:** If a withdrawal occurs within the same month as a deposit, the interest calculated is 0 to prevent "day-trading" interest exploits.
- **Precision:** All financial math is handled using high-precision decimals to avoid floating-point errors.

---

## Roadmap (Agile Sprints)
1. **Sprint 1:** Architecture, UML, and Database Design 
2. **Sprint 2:** Node.js Backend & API Development 
3. **Sprint 3:** React Frontend & Mobile Mockups
4. **Sprint 4:** Deployment & Documentation
