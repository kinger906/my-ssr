import { describe, it, expect } from 'vitest'
import { validateCreateItem, validateUpdateItem, validateId } from '../server/utils/validation'

describe('validateCreateItem', () => {
  it('should accept valid input', () => {
    const result = validateCreateItem({ name: 'Test Item' })
    expect(result.name).toBe('Test Item')
    expect(result.description).toBe('')
    expect(result.status).toBe('active')
  })

  it('should reject empty body', () => {
    expect(() => validateCreateItem(null)).toThrow()
    expect(() => validateCreateItem(undefined)).toThrow()
  })

  it('should reject empty name', () => {
    expect(() => validateCreateItem({ name: '' })).toThrow()
    expect(() => validateCreateItem({ name: '   ' })).toThrow()
  })

  it('should reject name exceeding 255 chars', () => {
    expect(() => validateCreateItem({ name: 'a'.repeat(256) })).toThrow()
  })

  it('should trim name and description', () => {
    const result = validateCreateItem({ name: '  Test  ', description: '  Desc  ' })
    expect(result.name).toBe('Test')
    expect(result.description).toBe('Desc')
  })

  it('should accept valid status', () => {
    const result = validateCreateItem({ name: 'Test', status: 'draft' })
    expect(result.status).toBe('draft')
  })

  it('should default invalid status to active', () => {
    const result = validateCreateItem({ name: 'Test', status: 'invalid' })
    expect(result.status).toBe('active')
  })
})

describe('validateUpdateItem', () => {
  it('should accept partial update', () => {
    const result = validateUpdateItem({ name: 'Updated' })
    expect(result.name).toBe('Updated')
  })

  it('should reject empty body', () => {
    expect(() => validateUpdateItem({})).toThrow()
  })

  it('should reject empty name in update', () => {
    expect(() => validateUpdateItem({ name: '' })).toThrow()
  })

  it('should reject invalid status', () => {
    expect(() => validateUpdateItem({ status: 'invalid' })).toThrow()
  })
})

describe('validateId', () => {
  it('should parse valid id', () => {
    expect(validateId('123')).toBe(123)
  })

  it('should reject invalid id', () => {
    expect(() => validateId('abc')).toThrow()
    expect(() => validateId('-1')).toThrow()
    expect(() => validateId('0')).toThrow()
  })
})