import { describe, it, expect } from 'vitest'
import { computeAuthFlags } from './authEnv'

describe('computeAuthFlags', () => {
  it('disables Clerk on public hosts regardless of key', () => {
    const flags = computeAuthFlags('user.github.io', false, true, false)
    expect(flags.FORCE_ANON).toBe(true)
    expect(flags.ENABLE_CLERK).toBe(false)
  })

  it('disables Clerk on prod builds regardless of host', () => {
    const flags = computeAuthFlags('localhost:5173', true, true, false)
    expect(flags.FORCE_ANON).toBe(true)
    expect(flags.ENABLE_CLERK).toBe(false)
  })

  it('enables Clerk only in dev with key and no runtime anon flag', () => {
    const flags = computeAuthFlags('localhost:5173', false, true, false)
    expect(flags.FORCE_ANON).toBe(false)
    expect(flags.ENABLE_CLERK).toBe(true)
  })

  it('forces anon when runtime anon flag is set', () => {
    const flags = computeAuthFlags('localhost:5173', false, true, true)
    expect(flags.FORCE_ANON).toBe(true)
    expect(flags.ENABLE_CLERK).toBe(false)
  })
})
