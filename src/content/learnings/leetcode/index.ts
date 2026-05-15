import type { ComponentType } from 'react'

import ThreeSum from './problems/three-sum.mdx'
import StockTrading from './problems/best-time-to-buy-and-sell-stock.mdx'
import TrappingRain from './problems/trapping-rain-water.mdx'
import Reorder from './problems/reorder-list.mdx'
import ProductExceptSelf from './problems/product-of-array-except-self.mdx'
import SearchMatrix from './problems/search-a-2d-matrix.mdx'
import Base62 from './problems/base62-encoding.mdx'
import Subarrays from './problems/subarrays-and-subsequences.mdx'

export type Problem = {
  priority: number
  type: string
  name: string
  leetcodeSlug: string
  /** If set, the user has written a solution writeup at /learnings/leetcode/<solutionSlug>. */
  solution?: {
    slug: string
    component: ComponentType
  }
}

export type Category = {
  slug: string
  title: string
  /** Optional category-level note that shows above the problem table. */
  note?: string
  problems: readonly Problem[]
}

const sol = (slug: string, component: ComponentType) => ({ slug, component })

export const categories: readonly Category[] = [
  {
    slug: 'arrays',
    title: 'Arrays',
    problems: [
      { priority: 1, type: 'Basic Traversal', name: 'Two Sum', leetcodeSlug: 'two-sum' },
      { priority: 2, type: 'Sorting', name: 'Sort Colors (Dutch National Flag)', leetcodeSlug: 'sort-colors' },
      { priority: 3, type: 'Prefix Sum', name: 'Subarray Sum Equals K', leetcodeSlug: 'subarray-sum-equals-k' },
      { priority: 4, type: "Kadane's Algorithm", name: 'Maximum Subarray', leetcodeSlug: 'maximum-subarray' },
      { priority: 5, type: 'Matrix', name: 'Rotate Image', leetcodeSlug: 'rotate-image' },
      { priority: 6, type: 'Merge Intervals', name: 'Merge Intervals', leetcodeSlug: 'merge-intervals' },
      {
        priority: 7, type: 'Product', name: 'Product of Array Except Self',
        leetcodeSlug: 'product-of-array-except-self',
        solution: sol('product-of-array-except-self', ProductExceptSelf),
      },
      { priority: 8, type: 'Rotation', name: 'Rotate Array', leetcodeSlug: 'rotate-array' },
      { priority: 9, type: 'Subarray', name: 'Longest Consecutive Sequence', leetcodeSlug: 'longest-consecutive' },
      { priority: 10, type: 'Advanced', name: 'First Missing Positive', leetcodeSlug: 'first-missing-positive' },
    ],
  },
  {
    slug: 'strings',
    title: 'Strings',
    problems: [
      { priority: 1, type: 'Reversal', name: 'Reverse String', leetcodeSlug: 'reverse-string' },
      { priority: 2, type: 'Anagram', name: 'Valid Anagram', leetcodeSlug: 'valid-anagram' },
      { priority: 3, type: 'Palindrome', name: 'Valid Palindrome', leetcodeSlug: 'valid-palindrome' },
      { priority: 4, type: 'Substring', name: 'Longest Substring Without Repeating Chars', leetcodeSlug: 'longest-substring-without-repeating-characters' },
      { priority: 5, type: 'Pattern Matching', name: 'Implement strStr()', leetcodeSlug: 'implement-strstr' },
      { priority: 6, type: 'Manipulation', name: 'String to Integer (atoi)', leetcodeSlug: 'string-to-integer-atoi' },
      { priority: 7, type: 'Encoding', name: 'Group Anagrams', leetcodeSlug: 'group-anagrams' },
      { priority: 8, type: 'Palindrome', name: 'Longest Palindromic Substring', leetcodeSlug: 'longest-palindromic-substring' },
      { priority: 9, type: 'Subsequence', name: 'Longest Common Subsequence', leetcodeSlug: 'longest-common-subsequence' },
      { priority: 10, type: 'Advanced', name: 'Minimum Window Substring', leetcodeSlug: 'minimum-window-substring' },
    ],
  },
  {
    slug: 'hashmaps',
    title: 'Hashmaps',
    problems: [
      { priority: 1, type: 'Frequency Count', name: 'Two Sum', leetcodeSlug: 'two-sum' },
      { priority: 2, type: 'Counting', name: 'Valid Anagram', leetcodeSlug: 'valid-anagram' },
      { priority: 3, type: 'Grouping', name: 'Group Anagrams', leetcodeSlug: 'group-anagrams' },
      { priority: 4, type: 'Subarray', name: 'Subarray Sum Equals K', leetcodeSlug: 'subarray-sum-equals-k' },
      { priority: 5, type: 'Duplicate Detection', name: 'Contains Duplicate', leetcodeSlug: 'contains-duplicate' },
      { priority: 6, type: 'Pattern', name: 'Isomorphic Strings', leetcodeSlug: 'isomorphic-strings' },
      { priority: 7, type: 'Caching', name: 'LRU Cache', leetcodeSlug: 'lru-cache' },
      { priority: 8, type: 'Frequency', name: 'Top K Frequent Elements', leetcodeSlug: 'top-k-frequent-elements' },
      { priority: 9, type: 'Consecutive', name: 'Longest Consecutive Sequence', leetcodeSlug: 'longest-consecutive' },
      { priority: 10, type: 'Advanced', name: 'Minimum Window Substring', leetcodeSlug: 'minimum-window-substring' },
    ],
  },
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    problems: [
      { priority: 1, type: 'Opposite Direction', name: 'Two Sum II (Sorted Array)', leetcodeSlug: 'two-sum-ii-input-array-is-sorted' },
      { priority: 2, type: 'Same Direction', name: 'Remove Duplicates from Sorted Array', leetcodeSlug: 'remove-duplicates-from-sorted-array' },
      { priority: 3, type: 'Palindrome', name: 'Valid Palindrome', leetcodeSlug: 'valid-palindrome' },
      { priority: 4, type: 'Three Pointers', name: 'Three Sum', leetcodeSlug: 'three-sum', solution: sol('three-sum', ThreeSum) },
      { priority: 5, type: 'Container', name: 'Container With Most Water', leetcodeSlug: 'container-with-most-water' },
      { priority: 6, type: 'Partition', name: 'Sort Colors (Dutch National Flag)', leetcodeSlug: 'sort-colors' },
      { priority: 7, type: 'Merging', name: 'Merge Sorted Array', leetcodeSlug: 'merge-sorted-array' },
      { priority: 8, type: 'Fast & Slow', name: 'Remove Nth Node From End of List', leetcodeSlug: 'remove-nth-node-from-end-of-list' },
      { priority: 9, type: 'Trapping', name: 'Trapping Rain Water', leetcodeSlug: 'trapping-rain-water', solution: sol('trapping-rain-water', TrappingRain) },
      { priority: 10, type: 'Advanced', name: 'Four Sum', leetcodeSlug: 'four-sum' },
    ],
  },
  {
    slug: 'linked-list',
    title: 'Linked List',
    problems: [
      { priority: 1, type: 'Reversal', name: 'Reverse Linked List', leetcodeSlug: 'reverse-linked-list' },
      { priority: 2, type: 'Fast & Slow Pointer', name: 'Linked List Cycle', leetcodeSlug: 'linked-list-cycle' },
      { priority: 3, type: 'Merge', name: 'Merge Two Sorted Lists', leetcodeSlug: 'merge-two-sorted-lists' },
      { priority: 4, type: 'Deletion', name: 'Remove Nth Node From End', leetcodeSlug: 'remove-nth-node-from-end-of-list' },
      { priority: 5, type: 'Intersection', name: 'Intersection of Two Linked Lists', leetcodeSlug: 'intersection-of-two-linked-lists' },
      { priority: 6, type: 'Palindrome', name: 'Palindrome Linked List', leetcodeSlug: 'palindrome-linked-list' },
      { priority: 7, type: 'Reorder', name: 'Reorder List', leetcodeSlug: 'reorder-list', solution: sol('reorder-list', Reorder) },
      { priority: 8, type: 'Advanced Reversal', name: 'Reverse Nodes in K-Group', leetcodeSlug: 'reverse-nodes-in-k-group' },
      { priority: 9, type: 'Copy', name: 'Copy List with Random Pointer', leetcodeSlug: 'copy-list-with-random-pointer' },
      { priority: 10, type: 'Merge Advanced', name: 'Merge K Sorted Lists', leetcodeSlug: 'merge-k-sorted-lists' },
    ],
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    problems: [
      { priority: 1, type: 'Fixed Window', name: 'Maximum Sum Subarray of Size K', leetcodeSlug: 'maximum-sum-subarray-of-size-k' },
      { priority: 2, type: 'Variable Window', name: 'Longest Substring Without Repeating Chars', leetcodeSlug: 'longest-substring-without-repeating-characters' },
      { priority: 3, type: 'Counting', name: 'Max Consecutive Ones III', leetcodeSlug: 'max-consecutive-ones-iii' },
      { priority: 4, type: 'Frequency', name: 'Permutation in String', leetcodeSlug: 'permutation-in-string' },
      { priority: 5, type: 'Anagram', name: 'Find All Anagrams in a String', leetcodeSlug: 'find-all-anagrams-in-a-string' },
      { priority: 6, type: 'Min Window', name: 'Minimum Window Substring', leetcodeSlug: 'minimum-window-substring' },
      { priority: 7, type: 'Subarray', name: 'Minimum Size Subarray Sum', leetcodeSlug: 'minimum-size-subarray-sum' },
      { priority: 8, type: 'Max Window', name: 'Sliding Window Maximum (Deque)', leetcodeSlug: 'sliding-window-maximum' },
      { priority: 9, type: 'Replacement', name: 'Longest Repeating Character Replacement', leetcodeSlug: 'longest-repeating-character-replacement' },
      { priority: 10, type: 'Advanced', name: 'Substring with Concatenation of All Words', leetcodeSlug: 'substring-with-concatenation-of-all-words' },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    problems: [
      { priority: 1, type: 'Basic Search', name: 'Binary Search', leetcodeSlug: 'binary-search' },
      { priority: 2, type: 'Boundary Finding', name: 'First Bad Version', leetcodeSlug: 'first-bad-version' },
      { priority: 3, type: 'Rotated Array', name: 'Search in Rotated Sorted Array', leetcodeSlug: 'search-in-rotated-sorted-array' },
      { priority: 4, type: 'Find Min/Max', name: 'Find Minimum in Rotated Sorted Array', leetcodeSlug: 'find-minimum-in-rotated-sorted-array' },
      { priority: 5, type: 'Peak Finding', name: 'Find Peak Element', leetcodeSlug: 'find-peak-element' },
      { priority: 6, type: 'Search Range', name: 'Find First and Last Position', leetcodeSlug: 'find-first-and-last-position-of-element-in-sorted-array' },
      { priority: 7, type: 'Matrix Search', name: 'Search a 2D Matrix', leetcodeSlug: 'search-a-2d-matrix', solution: sol('search-a-2d-matrix', SearchMatrix) },
      { priority: 8, type: 'Square Root', name: 'Sqrt(x)', leetcodeSlug: 'sqrtx' },
      { priority: 9, type: 'Capacity', name: 'Koko Eating Bananas', leetcodeSlug: 'koko-eating-bananas' },
      { priority: 10, type: 'Advanced', name: 'Median of Two Sorted Arrays', leetcodeSlug: 'median-of-two-sorted-arrays' },
    ],
  },
  {
    slug: 'trees',
    title: 'Trees',
    problems: [
      { priority: 1, type: 'Traversal', name: 'Binary Tree Inorder Traversal', leetcodeSlug: 'binary-tree-inorder-traversal' },
      { priority: 2, type: 'DFS', name: 'Maximum Depth of Binary Tree', leetcodeSlug: 'maximum-depth-of-binary-tree' },
      { priority: 3, type: 'BFS', name: 'Binary Tree Level Order Traversal', leetcodeSlug: 'binary-tree-level-order-traversal' },
      { priority: 4, type: 'Validation', name: 'Validate Binary Search Tree', leetcodeSlug: 'validate-binary-search-tree' },
      { priority: 5, type: 'Construction', name: 'Construct Tree from Preorder & Inorder', leetcodeSlug: 'construct-binary-tree-from-preorder-and-inorder-traversal' },
      { priority: 6, type: 'Path', name: 'Binary Tree Maximum Path Sum', leetcodeSlug: 'binary-tree-maximum-path-sum' },
      { priority: 7, type: 'LCA', name: 'Lowest Common Ancestor', leetcodeSlug: 'lowest-common-ancestor-of-a-binary-tree' },
      { priority: 8, type: 'Symmetry', name: 'Symmetric Tree', leetcodeSlug: 'symmetric-tree' },
      { priority: 9, type: 'Serialization', name: 'Serialize and Deserialize Binary Tree', leetcodeSlug: 'serialize-and-deserialize-binary-tree' },
      { priority: 10, type: 'BST Operations', name: 'Kth Smallest Element in a BST', leetcodeSlug: 'kth-smallest-element-in-a-bst' },
    ],
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    problems: [
      { priority: 1, type: 'BFS', name: 'Number of Islands', leetcodeSlug: 'number-of-islands' },
      { priority: 2, type: 'DFS', name: 'Clone Graph', leetcodeSlug: 'clone-graph' },
      { priority: 3, type: 'Cycle Detection', name: 'Course Schedule', leetcodeSlug: 'course-schedule' },
      { priority: 4, type: 'Topological Sort', name: 'Course Schedule II', leetcodeSlug: 'course-schedule-ii' },
      { priority: 5, type: 'Connected Components', name: 'Number of Connected Components', leetcodeSlug: 'number-of-connected-components-in-an-undirected-graph' },
      { priority: 6, type: 'Shortest Path', name: 'Shortest Path in Binary Matrix', leetcodeSlug: 'shortest-path-in-binary-matrix' },
      { priority: 7, type: 'Union Find', name: 'Redundant Connection', leetcodeSlug: 'redundant-connection' },
      { priority: 8, type: 'Dijkstra', name: 'Network Delay Time', leetcodeSlug: 'network-delay-time' },
      { priority: 9, type: 'Grid DFS', name: 'Word Search', leetcodeSlug: 'word-search' },
      { priority: 10, type: 'Advanced', name: 'Alien Dictionary', leetcodeSlug: 'alien-dictionary' },
    ],
  },
  {
    slug: 'stacks',
    title: 'Stacks',
    problems: [
      { priority: 1, type: 'Bracket Matching', name: 'Valid Parentheses', leetcodeSlug: 'valid-parentheses' },
      { priority: 2, type: 'Monotonic Stack', name: 'Next Greater Element', leetcodeSlug: 'next-greater-element-i' },
      { priority: 3, type: 'Design', name: 'Min Stack', leetcodeSlug: 'min-stack' },
      { priority: 4, type: 'Expression', name: 'Evaluate Reverse Polish Notation', leetcodeSlug: 'evaluate-reverse-polish-notation' },
      { priority: 5, type: 'String', name: 'Remove All Adjacent Duplicates', leetcodeSlug: 'remove-all-adjacent-duplicates-in-string' },
      { priority: 6, type: 'Monotonic Stack', name: 'Daily Temperatures', leetcodeSlug: 'daily-temperatures' },
      { priority: 7, type: 'Area', name: 'Largest Rectangle in Histogram', leetcodeSlug: 'largest-rectangle-in-histogram' },
      { priority: 8, type: 'Expression', name: 'Basic Calculator', leetcodeSlug: 'basic-calculator' },
      { priority: 9, type: 'Monotonic Stack', name: 'Stock Span Problem', leetcodeSlug: 'online-stock-span' },
      { priority: 10, type: 'Area', name: 'Trapping Rain Water', leetcodeSlug: 'trapping-rain-water', solution: sol('trapping-rain-water', TrappingRain) },
    ],
  },
  {
    slug: 'queues',
    title: 'Queues',
    problems: [
      { priority: 1, type: 'BFS', name: 'Binary Tree Level Order Traversal', leetcodeSlug: 'binary-tree-level-order-traversal' },
      { priority: 2, type: 'BFS Grid', name: 'Rotting Oranges', leetcodeSlug: 'rotting-oranges' },
      { priority: 3, type: 'Design', name: 'Implement Queue using Stacks', leetcodeSlug: 'implement-queue-using-stacks' },
      { priority: 4, type: 'Sliding Window', name: 'Sliding Window Maximum (Deque)', leetcodeSlug: 'sliding-window-maximum' },
      { priority: 5, type: 'BFS Shortest Path', name: 'Open the Lock', leetcodeSlug: 'open-the-lock' },
      { priority: 6, type: 'Design', name: 'Design Circular Queue', leetcodeSlug: 'design-circular-queue' },
      { priority: 7, type: 'Priority Queue', name: 'Kth Largest Element in a Stream', leetcodeSlug: 'kth-largest-element-in-a-stream' },
      { priority: 8, type: 'BFS', name: 'Perfect Squares', leetcodeSlug: 'perfect-squares' },
      { priority: 9, type: 'Scheduling', name: 'Task Scheduler', leetcodeSlug: 'task-scheduler' },
      { priority: 10, type: 'Advanced', name: 'Design Hit Counter', leetcodeSlug: 'design-hit-counter' },
    ],
  },
  {
    slug: 'heaps',
    title: 'Heaps / Priority Queue',
    problems: [
      { priority: 1, type: 'Top K', name: 'Kth Largest Element in an Array', leetcodeSlug: 'kth-largest-element-in-an-array' },
      { priority: 2, type: 'Frequency', name: 'Top K Frequent Elements', leetcodeSlug: 'top-k-frequent-elements' },
      { priority: 3, type: 'Merge', name: 'Merge K Sorted Lists', leetcodeSlug: 'merge-k-sorted-lists' },
      { priority: 4, type: 'Scheduling', name: 'Task Scheduler', leetcodeSlug: 'task-scheduler' },
      { priority: 5, type: 'Median', name: 'Find Median from Data Stream', leetcodeSlug: 'find-median-from-data-stream' },
      { priority: 6, type: 'Sorting', name: 'Sort Characters By Frequency', leetcodeSlug: 'sort-characters-by-frequency' },
      { priority: 7, type: 'Closest', name: 'K Closest Points to Origin', leetcodeSlug: 'k-closest-points-to-origin' },
      { priority: 8, type: 'Interval', name: 'Meeting Rooms II', leetcodeSlug: 'meeting-rooms-ii' },
      { priority: 9, type: 'Greedy + Heap', name: 'Reorganize String', leetcodeSlug: 'reorganize-string' },
      { priority: 10, type: 'Advanced', name: 'IPO', leetcodeSlug: 'ipo' },
    ],
  },
  {
    slug: 'dp',
    title: 'Dynamic Programming',
    problems: [
      { priority: 1, type: '1D Basic', name: 'Climbing Stairs', leetcodeSlug: 'climbing-stairs' },
      { priority: 2, type: '1D', name: 'House Robber', leetcodeSlug: 'house-robber' },
      { priority: 3, type: 'Fibonacci', name: 'Fibonacci Number', leetcodeSlug: 'fibonacci-number' },
      { priority: 4, type: 'Knapsack', name: 'Coin Change', leetcodeSlug: 'coin-change' },
      { priority: 5, type: 'Subsequence', name: 'Longest Increasing Subsequence', leetcodeSlug: 'longest-increasing-subsequence' },
      { priority: 6, type: 'String DP', name: 'Longest Common Subsequence', leetcodeSlug: 'longest-common-subsequence' },
      { priority: 7, type: '2D Grid', name: 'Unique Paths', leetcodeSlug: 'unique-paths' },
      { priority: 8, type: 'Partition', name: 'Partition Equal Subset Sum', leetcodeSlug: 'partition-equal-subset-sum' },
      { priority: 9, type: 'String DP', name: 'Edit Distance', leetcodeSlug: 'edit-distance' },
      { priority: 10, type: 'Interval DP', name: 'Longest Palindromic Subsequence', leetcodeSlug: 'longest-palindromic-subsequence' },
      {
        priority: 11, type: 'Stock', name: 'Best Time to Buy and Sell Stock',
        leetcodeSlug: 'best-time-to-buy-and-sell-stock',
        solution: sol('best-time-to-buy-and-sell-stock', StockTrading),
      },
    ],
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    note: `**Sudoku — finding duplicates in a 3×3 box.** Map each cell (i, j) to its box with \`box_id = (i // 3) * 3 + (j // 3)\`. \`i // 3\` picks the box-row, \`j // 3\` picks the box-column; multiplying the row by 3 and adding the column gives a unique id 0–8 — same idea as flattening a 2D grid to 1D.`,
    problems: [
      { priority: 1, type: 'Subsets', name: 'Subsets', leetcodeSlug: 'subsets' },
      { priority: 2, type: 'Permutations', name: 'Permutations', leetcodeSlug: 'permutations' },
      { priority: 3, type: 'Combinations', name: 'Combination Sum', leetcodeSlug: 'combination-sum' },
      { priority: 4, type: 'String', name: 'Letter Combinations of a Phone Number', leetcodeSlug: 'letter-combinations-of-a-phone-number' },
      { priority: 5, type: 'Grid', name: 'Word Search', leetcodeSlug: 'word-search' },
      { priority: 6, type: 'Partition', name: 'Palindrome Partitioning', leetcodeSlug: 'palindrome-partitioning' },
      { priority: 7, type: 'N-Queens', name: 'N-Queens', leetcodeSlug: 'n-queens' },
      { priority: 8, type: 'Sudoku', name: 'Sudoku Solver', leetcodeSlug: 'sudoku-solver' },
      { priority: 9, type: 'Combinations', name: 'Combination Sum II', leetcodeSlug: 'combination-sum-ii' },
      { priority: 10, type: 'Advanced', name: 'Generate Parentheses', leetcodeSlug: 'generate-parentheses' },
    ],
  },
  {
    slug: 'greedy',
    title: 'Greedy',
    problems: [
      { priority: 1, type: 'Interval', name: 'Meeting Rooms', leetcodeSlug: 'meeting-rooms' },
      { priority: 2, type: 'Jump', name: 'Jump Game', leetcodeSlug: 'jump-game' },
      { priority: 3, type: 'Interval', name: 'Non-overlapping Intervals', leetcodeSlug: 'non-overlapping-intervals' },
      { priority: 4, type: 'Assignment', name: 'Assign Cookies', leetcodeSlug: 'assign-cookies' },
      { priority: 5, type: 'Scheduling', name: 'Minimum Number of Arrows', leetcodeSlug: 'minimum-number-of-arrows-to-burst-balloons' },
      { priority: 6, type: 'Partition', name: 'Partition Labels', leetcodeSlug: 'partition-labels' },
      { priority: 7, type: 'Gas Station', name: 'Gas Station', leetcodeSlug: 'gas-station' },
      { priority: 8, type: 'Jump', name: 'Jump Game II', leetcodeSlug: 'jump-game-ii' },
      { priority: 9, type: 'Stock', name: 'Best Time to Buy and Sell Stock II', leetcodeSlug: 'best-time-to-buy-and-sell-stock-ii' },
      { priority: 10, type: 'Advanced', name: 'Candy', leetcodeSlug: 'candy' },
    ],
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    problems: [
      { priority: 1, type: 'Basic', name: 'Single Number', leetcodeSlug: 'single-number' },
      { priority: 2, type: 'Counting Bits', name: 'Number of 1 Bits', leetcodeSlug: 'number-of-1-bits' },
      { priority: 3, type: 'Power of Two', name: 'Power of Two', leetcodeSlug: 'power-of-two' },
      { priority: 4, type: 'Counting', name: 'Counting Bits', leetcodeSlug: 'counting-bits' },
      { priority: 5, type: 'Missing', name: 'Missing Number', leetcodeSlug: 'missing-number' },
      { priority: 6, type: 'XOR', name: 'Single Number II', leetcodeSlug: 'single-number-ii' },
      { priority: 7, type: 'Reverse', name: 'Reverse Bits', leetcodeSlug: 'reverse-bits' },
      { priority: 8, type: 'Sum', name: 'Sum of Two Integers (no + operator)', leetcodeSlug: 'sum-of-two-integers' },
      { priority: 9, type: 'Subset', name: 'Subsets (using bitmask)', leetcodeSlug: 'subsets' },
      { priority: 10, type: 'Advanced', name: 'Bitwise AND of Numbers Range', leetcodeSlug: 'bitwise-and-of-numbers-range' },
    ],
  },
]

// Extra writeups not tied to any specific LeetCode category index.
export const extraProblems: ReadonlyArray<{ slug: string; title: string; component: ComponentType; summary: string }> = [
  {
    slug: 'base62-encoding',
    title: 'Base62 Encoding',
    component: Base62,
    summary: 'Integer → URL-safe short code. Same pattern as the URL shortener.',
  },
  {
    slug: 'subarrays-and-subsequences',
    title: 'Subarrays & Subsequences',
    component: Subarrays,
    summary: 'The two terms are different — and most "all subarrays" problems are solved without enumeration.',
  },
]
