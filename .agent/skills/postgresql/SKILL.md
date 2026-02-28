---
name: postgresql
description: "Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features"
risk: unknown
source: community
---
# PostgreSQL Table Design

## Use this skill when
- Designing a schema for PostgreSQL
- Selecting data types and constraints
- Planning indexes, partitions, or RLS policies
- Reviewing tables for scale and maintainability

## Instructions
1. Capture entities, access patterns, and scale targets.
2. Choose data types and constraints.
3. Add indexes and validate with `EXPLAIN`.
4. Plan partitioning or RLS where required.
5. Review migration impact.

## Core Rules
- Define a **PRIMARY KEY** (prefer `BIGINT GENERATED ALWAYS AS IDENTITY`).
- **Normalize first (to 3NF)**.
- Add **NOT NULL** everywhere required; use **DEFAULT**s.
- Create **indexes for access paths**.
- Prefer **TIMESTAMPTZ** for time; **NUMERIC** for money; **TEXT** for strings.

## Data Types
- **IDs**: `BIGINT GENERATED ALWAYS AS IDENTITY`.
- **Strings**: prefer `TEXT`.
- **JSONB**: preferred over JSON; index with **GIN**.

## Indexing
- **B-tree**: default for equality/range queries.
- **GIN**: JSONB, arrays, full-text search.
- **GiST**: ranges, geometry, exclusion constraints.

## When to Use
This skill is applicable to execute the workflow or actions described in the overview.
