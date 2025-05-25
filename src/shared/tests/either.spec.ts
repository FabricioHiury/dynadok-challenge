import { Left, Right, left, right } from '../either'

describe('Either', () => {
  describe('Left', () => {
    it('should create a Left instance', () => {
      const leftValue = left('error message')

      expect(leftValue).toBeInstanceOf(Left)
      expect(leftValue.isLeft()).toBe(true)
      expect(leftValue.isRight()).toBe(false)
      expect(leftValue.value).toBe('error message')
    })
  })

  describe('Right', () => {
    it('should create a Right instance', () => {
      const rightValue = right('success value')

      expect(rightValue).toBeInstanceOf(Right)
      expect(rightValue.isRight()).toBe(true)
      expect(rightValue.isLeft()).toBe(false)
      expect(rightValue.value).toBe('success value')
    })
  })

  describe('Type guards', () => {
    it('should correctly identify Left values', () => {
      const leftValue = left('error')

      if (leftValue.isLeft()) {
        expect(leftValue.value).toBe('error')
      }
    })

    it('should correctly identify Right values', () => {
      const rightValue = right('success')

      if (rightValue.isRight()) {
        expect(rightValue.value).toBe('success')
      }
    })
  })
})
