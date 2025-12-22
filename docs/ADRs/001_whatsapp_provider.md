# ADR-001: WhatsApp Provider Selection

**Status**: Accepted  
**Date**: 2024-12-22  
**Decision Makers**: Moseti (Founder)

## Context

Fikanova requires a bidirectional WhatsApp integration for the CEO command routing system. Users (primarily the founder) will send commands via WhatsApp that route to appropriate C-Suite agents, and agents will send drafts/alerts back.

## Options Considered

### Option 1: Twilio WhatsApp API
- **Pros**: Global leader, extensive documentation, large community
- **Cons**: USD billing (forex volatility), data stored outside Kenya, higher latency for African users

### Option 2: Sozuri
- **Pros**: 
  - Native Kenya compliance (data residency)
  - KES billing (no forex volatility)
  - Lower latency for East African users
  - Already used in Midesa project (familiarity)
- **Cons**: Smaller community, less documentation

### Option 3: Meta Cloud API (Direct)
- **Pros**: No middleman costs
- **Cons**: Complex setup, requires Facebook Business verification

## Decision

**Sozuri** selected for the following reasons:
1. Kenya data residency compliance (important for future fundraising)
2. KES billing eliminates exchange rate risks
3. Already integrated in sister project (Midesa) - faster implementation
4. Lower latency for primary user base

## Consequences

- Webhook format follows Sozuri specification
- Environment variables: `SOZURI_WEBHOOK_SECRET`, `SOZURI_API_KEY`
- Future multi-region expansion may require adding Twilio as secondary provider

## References

- [Sozuri WhatsApp API Docs](https://docs.sozuri.com)
- [Midesa Integration](../../../apps/midesa) (reference implementation)
