// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function loggedMethod(
  originalMethod: any,
  _context: ClassMethodDecoratorContext
) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log('LOG: Entering method.')
    const result = originalMethod.call(this, ...args)
    console.log('LOG: Exiting method.')
    return result
  }

  return replacementMethod
}

export function needsLoginMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext
) {
  if (!this.cookie) {
    throw new Error(`You must be logged in to use ${context.name as string}`)
  }
}
