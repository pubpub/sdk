/**
 * Wrap an expression into an assertion function.
 *
 * @param {RegExp} expression
 *   Test expression.
 * @returns {TestFunction}
 *   Test function.
 */
function wrapExpression(expression: RegExp): TestFunction {
  return assertion

  /** @type {TestFunction} */
  function assertion(value) {
    return expression.test(value)
  }
}

import type { Heading, Root, RootContent } from 'mdast'
import type { Node as UnistNode, Parent as UnistParent } from 'unist'

/**
 * Number; capped reasonably.
 */
export type Uint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
/**
 * Increment a number in the type system.
 */
export type Increment<I extends Uint = 0> = I extends 0
  ? 1
  : I extends 1
    ? 2
    : I extends 2
      ? 3
      : I extends 3
        ? 4
        : I extends 4
          ? 5
          : I extends 5
            ? 6
            : I extends 6
              ? 7
              : I extends 7
                ? 8
                : I extends 8
                  ? 9
                  : 10
/**
 * Collect all (inclusive) descendants of `Tree`.
 *
 * > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 * > recurse without actually running into an infinite loop, which the
 * > previous version did.
 * >
 * > Practically, a max of `2` is typically enough assuming a `Root` is
 * > passed, but it doesn’t improve performance.
 * > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 * > Using up to `10` doesn’t hurt or help either.
 */
export type InclusiveDescendant<
  Tree extends UnistNode,
  Max extends Uint = 10,
  Depth extends Uint = 0,
> = Tree extends UnistParent
  ? Depth extends Max
    ? Tree
    :
        | Tree
        | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
  : Tree
/**
 * Collect nodes that can be parents of `Child`.
 */
export type InternalChild<Node extends UnistNode> = Node extends {
  children: (infer Child_1)[]
}
  ? Child_1
  : never
/**
 * Collect nodes that can be parents of `Child`.
 */
export type InternalParent<
  Node extends UnistNode,
  Kind extends UnistNode,
> = Node extends UnistParent
  ? Node extends {
      children: (infer Children)[]
    }
    ? Kind extends Children
      ? Node
      : never
    : never
  : never
/**
 * Collect nodes in `Tree` that can be parents of `Child`.
 */
export type Child<Tree extends UnistNode> = InternalChild<
  InclusiveDescendant<Tree>
>
/**
 * Collect nodes in `Tree` that can be parents of `Child`.
 */
export type Parent<
  Tree extends UnistNode,
  Kind extends UnistNode,
> = InternalParent<InclusiveDescendant<Tree>, Kind>
/**
 * Callback called when a section is found.
 */
export type Handler = (
  start: Heading,
  between: Array<RootContent>,
  end: RootContent | undefined,
  scope: Info,
) => Array<RootContent | null | undefined> | null | undefined | void
/**
 * Extra info.
 */
export type Info = {
  /**
   *   Parent of the section.
   */
  parent: Parent<Root, Heading>
  /**
   *   Index of `start` in `parent`.
   */
  start: number
  /**
   *   Index of `end` in `parent`.
   */
  end: number | undefined
}
/**
 * Configuration.
 */
export type Options = {
  /**
   *   Test for a heading.
   */
  test: Test
  /**
   * Ignore final definitions otherwise in the section (default: `false`).
   */
  ignoreFinalDefinitions?: boolean | null | undefined
}
/**
 * Test for a heading.
 *
 * When `string`, wrapped in `new RegExp('^(' + value + ')$', 'i')`;
 * when `RegExp`, wrapped in `(value) => expression.test(value)`
 */
export type Test = RegExp | TestFunction | string
/**
 * Check if a node matches.
 */
export type TestFunction = (
  value: string,
  node: Heading,
) => boolean | null | undefined | void

import { toString } from 'mdast-util-to-string'

/**
 * Search `tree` for a heading matching `test` and change its “section” with
 * `handler`.
 *
 * A “section” ranges from the matched heading until the next heading of the
 * same or lower depth, or the end of the document.
 *
 * If `ignoreFinalDefinitions: true`, final definitions “in” the section are
 * excluded.
 *
 * @param {Parent<Root, Heading>} tree
 *   Tree to change.
 * @param {Options | Test} options
 *   Configuration.
 * @param {Handler} handler
 *   Handle a section.
 * @returns {undefined}
 *   Nothing.
 */
export function headingRange(
  tree: Parent<Root, Heading>,
  options: Options | Test,
  handler: Handler,
): undefined {
  let test = options
  const children = 'children' in tree ? tree.children : []
  //  let ignoreFinalDefinitions = false

  if (test && typeof test === 'object' && !('exec' in test)) {
    // ignoreFinalDefinitions = test.ignoreFinalDefinitions === true
    test = test.test
  }

  if (typeof test === 'string') {
    test = new RegExp('^(' + test + ')$', 'i')
  }

  if (test && 'exec' in test) {
    test = wrapExpression(test)
  }

  if (typeof test !== 'function') {
    throw new TypeError(
      'Expected `string`, `regexp`, or `function` for `test`, not `' +
        test +
        '`',
    )
  }
  let index = 0
  while (index < children.length) {
    let start: number | undefined,
      end: number | undefined,
      depth: number | undefined

    for (let i = index; i < children.length; i++) {
      const child = children[i]

      if (child.type === 'heading') {
        if (depth && child.depth <= depth) {
          end = i
          break
        }

        if (!depth && test(toString(child), child)) {
          depth = child.depth
          start = i
          end = children.length
        }
      }
    }

    if (depth && end !== undefined && start !== undefined) {
      const head = children[start] as Heading
      const from = children.slice(start + 1, end)
      const nodes = (handler(head, from, children[end], {
        parent: tree,
        start,
        end: end,
      })?.filter(Boolean) ?? []) as RootContent[]

      if (nodes) {
        children.splice(start, end - start, ...nodes)
        index = start + nodes.length
      } else {
        index = end
      }
    } else {
      // If no section was found or modified, move the index forward to avoid a loop.
      index++
    }
  }
}
