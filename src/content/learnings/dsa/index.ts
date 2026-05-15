import Arrays from './01-arrays.mdx'
import Strings from './02-strings.mdx'
import Hashmaps from './03-hashmaps.mdx'
import TwoPointers from './04-two-pointers.mdx'
import LinkedList from './05-linked-list.mdx'
import SlidingWindow from './06-sliding-window.mdx'
import BinarySearch from './07-binary-search.mdx'
import Trees from './08-trees.mdx'
import Graphs from './09-graphs.mdx'
import Stacks from './10-stacks.mdx'
import Tries from './11-tries.mdx'
import Backtracking from './12-backtracking.mdx'
import Practice from './13-practice.mdx'
import type { LearningTopic } from '../../../components/learnings/LearningPage'

export const dsaTopics: readonly LearningTopic[] = [
  {
    slug: 'arrays',
    title: 'Arrays',
    summary: 'Prefix sums, Kadane\'s, merge intervals, matrix rotation.',
    tech: ['Python', 'Fundamentals'],
    component: Arrays,
  },
  {
    slug: 'strings',
    title: 'Strings',
    summary: 'Reversal, anagrams, palindromes, substring search.',
    tech: ['Python', 'Strings'],
    component: Strings,
  },
  {
    slug: 'hashmaps',
    title: 'Hashmaps',
    summary: 'O(1) lookups, frequency counts, prefix-sum + hash patterns.',
    tech: ['Python', 'Hash Tables'],
    component: Hashmaps,
  },
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    summary: 'Opposite ends, same direction, fast/slow — turning O(n²) into O(n).',
    tech: ['Python', 'Pointers'],
    component: TwoPointers,
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    summary: 'Reversal, cycle detection, merging, reordering.',
    tech: ['Python', 'Linked Lists'],
    component: LinkedList,
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    summary: 'Fixed and variable-size windows for subarray and substring problems.',
    tech: ['Python', 'Windowing'],
    component: SlidingWindow,
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    summary: 'Sorted arrays, rotated arrays, matrices, answer-space search.',
    tech: ['Python', 'Search'],
    component: BinarySearch,
  },
  {
    slug: 'trees',
    title: 'Trees',
    summary: 'DFS/BFS traversals, BST patterns, path problems, LCA.',
    tech: ['Python', 'Recursion'],
    component: Trees,
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    summary: 'BFS/DFS on graphs and grids, topological sort, union-find, Dijkstra.',
    tech: ['Python', 'Graph Algorithms'],
    component: Graphs,
  },
  {
    slug: 'stacks',
    title: 'Stacks',
    summary: 'Monotonic stacks, bracket matching, histogram, next-greater patterns.',
    tech: ['Python', 'Stacks'],
    component: Stacks,
  },
  {
    slug: 'tries',
    title: 'Tries',
    summary: 'Prefix tree for string search, autocomplete, and dictionary lookups.',
    tech: ['Python', 'Prefix Trees'],
    component: Tries,
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    summary: 'Systematic search with pruning: subsets, permutations, N-Queens, Sudoku.',
    tech: ['Python', 'Recursion'],
    component: Backtracking,
  },
  {
    slug: 'practice',
    title: 'Practice',
    summary: 'Warm-up problems to build intuition before formal DSA techniques.',
    tech: ['Python', 'Foundation'],
    component: Practice,
  },
]
