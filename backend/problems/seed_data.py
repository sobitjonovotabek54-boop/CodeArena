"""Seed problem definitions for CodeArena."""

STARTER = {
    "python": "import sys\n\ndef main():\n    data = sys.stdin.read().strip().split()\n    # Write your solution\n    pass\n\nif __name__ == '__main__':\n    main()\n",
    "javascript": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/);\n// Write your solution\n",
    "cpp": "#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // Write your solution\n    return 0;\n}\n",
    "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution\n    }\n}\n",
}


def starter_for(fn_hint: str = "") -> dict:
    py = STARTER["python"]
    if fn_hint:
        py = f"import sys\n\n{fn_hint}\n\nif __name__ == '__main__':\n    pass\n"
    return {
        "python": py,
        "javascript": STARTER["javascript"],
        "cpp": STARTER["cpp"],
        "java": STARTER["java"],
    }


# Each problem: title, difficulty, category_slug, description, constraints,
# input_format, output_format, examples, tests: [{input, output, sample?}], solution_python
PROBLEMS = [
    # ========== EASY (10) ==========
    {
        "title": "Two Sum",
        "difficulty": "easy",
        "category": "arrays",
        "description": "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.\n\nReturn the indices in ascending order.",
        "constraints": "2 <= n <= 10^4\n-10^9 <= nums[i], target <= 10^9",
        "input_format": "First line: n target\nSecond line: n integers (nums)",
        "output_format": "Two indices separated by space",
        "examples": [
            {"input": "4 9\n2 7 11 15", "output": "0 1", "explanation": "nums[0]+nums[1]=9"},
        ],
        "tests": [
            {"input": "4 9\n2 7 11 15", "output": "0 1", "sample": True},
            {"input": "3 6\n3 2 4", "output": "1 2", "sample": True},
            {"input": "2 6\n3 3", "output": "0 1", "sample": False},
            {"input": "4 9\n1 4 5 3", "output": "1 2", "sample": False},
        ],
        "solution": """import sys
data = list(map(int, sys.stdin.read().split()))
n, target = data[0], data[1]
nums = data[2:]
seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        a, b = seen[target - x], i
        print(min(a, b), max(a, b))
        break
    seen[x] = i
""",
    },
    {
        "title": "Reverse String",
        "difficulty": "easy",
        "category": "strings",
        "description": "Write a function that reverses a string. The input string is given as a sequence of characters.\n\nPrint the reversed string.",
        "constraints": "1 <= s.length <= 10^5\ns consists of printable ASCII",
        "input_format": "A single line containing the string s",
        "output_format": "The reversed string",
        "examples": [{"input": "hello", "output": "olleh", "explanation": ""}],
        "tests": [
            {"input": "hello", "output": "olleh", "sample": True},
            {"input": "CodeArena", "output": "anerAedoC", "sample": True},
            {"input": "a", "output": "a", "sample": False},
            {"input": "ab", "output": "ba", "sample": False},
        ],
        "solution": "import sys\nprint(sys.stdin.read().rstrip('\\n')[::-1])\n",
    },
    {
        "title": "FizzBuzz",
        "difficulty": "easy",
        "category": "math",
        "description": "Given an integer n, for every integer i from 1 to n:\n- print \"FizzBuzz\" if i divisible by 3 and 5\n- print \"Fizz\" if divisible by 3\n- print \"Buzz\" if divisible by 5\n- otherwise print i\n\nPrint each on its own line.",
        "constraints": "1 <= n <= 10^4",
        "input_format": "A single integer n",
        "output_format": "n lines of FizzBuzz results",
        "examples": [{"input": "5", "output": "1\n2\nFizz\n4\nBuzz", "explanation": ""}],
        "tests": [
            {"input": "5", "output": "1\n2\nFizz\n4\nBuzz", "sample": True},
            {"input": "15", "output": "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", "sample": True},
            {"input": "1", "output": "1", "sample": False},
        ],
        "solution": """n=int(input())
for i in range(1,n+1):
    if i%15==0: print('FizzBuzz')
    elif i%3==0: print('Fizz')
    elif i%5==0: print('Buzz')
    else: print(i)
""",
    },
    {
        "title": "Valid Palindrome",
        "difficulty": "easy",
        "category": "strings",
        "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nPrint `true` or `false`.",
        "constraints": "1 <= s.length <= 2*10^5",
        "input_format": "A single line string s",
        "output_format": "true or false",
        "examples": [{"input": "A man, a plan, a canal: Panama", "output": "true", "explanation": ""}],
        "tests": [
            {"input": "A man, a plan, a canal: Panama", "output": "true", "sample": True},
            {"input": "race a car", "output": "false", "sample": True},
            {"input": " ", "output": "true", "sample": False},
            {"input": "0P", "output": "false", "sample": False},
        ],
        "solution": """import sys
s=''.join(c.lower() for c in sys.stdin.read() if c.isalnum())
print('true' if s==s[::-1] else 'false')
""",
    },
    {
        "title": "Maximum of Array",
        "difficulty": "easy",
        "category": "arrays",
        "description": "Given n integers, find and print the maximum value.",
        "constraints": "1 <= n <= 10^5\n-10^9 <= a_i <= 10^9",
        "input_format": "First line: n\nSecond line: n integers",
        "output_format": "A single integer — the maximum",
        "examples": [{"input": "5\n1 3 2 8 4", "output": "8", "explanation": ""}],
        "tests": [
            {"input": "5\n1 3 2 8 4", "output": "8", "sample": True},
            {"input": "3\n-5 -1 -9", "output": "-1", "sample": True},
            {"input": "1\n42", "output": "42", "sample": False},
        ],
        "solution": "n=int(input()); print(max(map(int,input().split())))\n",
    },
    {
        "title": "Binary Search",
        "difficulty": "easy",
        "category": "searching",
        "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        "constraints": "1 <= n <= 10^4\n-10^4 <= nums[i], target <= 10^4",
        "input_format": "First line: n target\nSecond line: n sorted integers",
        "output_format": "Index or -1",
        "examples": [{"input": "6 9\n-1 0 3 5 9 12", "output": "4", "explanation": ""}],
        "tests": [
            {"input": "6 9\n-1 0 3 5 9 12", "output": "4", "sample": True},
            {"input": "6 2\n-1 0 3 5 9 12", "output": "-1", "sample": True},
            {"input": "1 1\n1", "output": "0", "sample": False},
        ],
        "solution": """data=list(map(int,open(0).read().split()))
n,t=data[0],data[1]; a=data[2:]
lo,hi=0,n-1; ans=-1
while lo<=hi:
    mid=(lo+hi)//2
    if a[mid]==t: ans=mid; break
    elif a[mid]<t: lo=mid+1
    else: hi=mid-1
print(ans)
""",
    },
    {
        "title": "Factorial",
        "difficulty": "easy",
        "category": "math",
        "description": "Compute n! (factorial of n).",
        "constraints": "0 <= n <= 20",
        "input_format": "A single integer n",
        "output_format": "n!",
        "examples": [{"input": "5", "output": "120", "explanation": ""}],
        "tests": [
            {"input": "5", "output": "120", "sample": True},
            {"input": "0", "output": "1", "sample": True},
            {"input": "10", "output": "3628800", "sample": False},
        ],
        "solution": "n=int(input()); r=1\nfor i in range(2,n+1): r*=i\nprint(r)\n",
    },
    {
        "title": "Count Vowels",
        "difficulty": "easy",
        "category": "strings",
        "description": "Count the number of vowels (a, e, i, o, u) in a string (case-insensitive).",
        "constraints": "0 <= s.length <= 10^5",
        "input_format": "A single line string",
        "output_format": "Integer count of vowels",
        "examples": [{"input": "CodeArena", "output": "5", "explanation": ""}],
        "tests": [
            {"input": "CodeArena", "output": "5", "sample": True},
            {"input": "xyz", "output": "0", "sample": True},
            {"input": "AEIOU", "output": "5", "sample": False},
        ],
        "solution": "s=input(); print(sum(c.lower() in 'aeiou' for c in s))\n",
    },
    {
        "title": "Merge Two Sorted Lists",
        "difficulty": "easy",
        "category": "data-structures",
        "description": "Merge two sorted arrays into one sorted array.",
        "constraints": "0 <= n, m <= 10^4",
        "input_format": "First line: n m\nSecond line: n sorted ints\nThird line: m sorted ints",
        "output_format": "Merged sorted array on one line",
        "examples": [{"input": "3 3\n1 2 4\n1 3 4", "output": "1 1 2 3 4 4", "explanation": ""}],
        "tests": [
            {"input": "3 3\n1 2 4\n1 3 4", "output": "1 1 2 3 4 4", "sample": True},
            {"input": "0 1\n0", "output": "0", "sample": True},
            {"input": "2 2\n1 3\n2 4", "output": "1 2 3 4", "sample": False},
        ],
        "solution": """import sys
raw = sys.stdin.read().strip().split()
n, m = int(raw[0]), int(raw[1])
nums = list(map(int, raw[2:]))
a, b = nums[:n], nums[n:n+m]
i = j = 0
out = []
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        out.append(a[i]); i += 1
    else:
        out.append(b[j]); j += 1
out.extend(a[i:]); out.extend(b[j:])
print(' '.join(map(str, out)))
""",
    },
    {
        "title": "Sum of Digits",
        "difficulty": "easy",
        "category": "math",
        "description": "Given a non-negative integer n, compute the sum of its digits.",
        "constraints": "0 <= n <= 10^18",
        "input_format": "A single integer n",
        "output_format": "Sum of digits",
        "examples": [{"input": "123", "output": "6", "explanation": ""}],
        "tests": [
            {"input": "123", "output": "6", "sample": True},
            {"input": "0", "output": "0", "sample": True},
            {"input": "9999", "output": "36", "sample": False},
        ],
        "solution": "print(sum(int(c) for c in input().strip()))\n",
    },
    # ========== MEDIUM (12) ==========
    {
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": "medium",
        "category": "strings",
        "description": "Given a string s, find the length of the longest substring without repeating characters.",
        "constraints": "0 <= s.length <= 5*10^4",
        "input_format": "A single line string s",
        "output_format": "Integer length",
        "examples": [{"input": "abcabcbb", "output": "3", "explanation": "abc"}],
        "tests": [
            {"input": "abcabcbb", "output": "3", "sample": True},
            {"input": "bbbbb", "output": "1", "sample": True},
            {"input": "pwwkew", "output": "3", "sample": False},
            {"input": "", "output": "0", "sample": False},
        ],
        "solution": """import sys
s=sys.stdin.read().rstrip('\\n')
best=0; start=0; last={}
for i,c in enumerate(s):
    if c in last and last[c]>=start:
        start=last[c]+1
    last[c]=i
    best=max(best,i-start+1)
print(best)
""",
    },
    {
        "title": "3Sum Closest",
        "difficulty": "medium",
        "category": "arrays",
        "description": "Given an integer array nums of length n and an integer target, find three integers in nums such that the sum is closest to target. Return that sum.",
        "constraints": "3 <= n <= 500\n-1000 <= nums[i], target <= 1000",
        "input_format": "First line: n target\nSecond line: n integers",
        "output_format": "The closest sum",
        "examples": [{"input": "4 1\n-1 2 1 -4", "output": "2", "explanation": ""}],
        "tests": [
            {"input": "4 1\n-1 2 1 -4", "output": "2", "sample": True},
            {"input": "3 1\n0 0 0", "output": "0", "sample": True},
            {"input": "5 100\n1 1 1 0 2", "output": "4", "sample": False},
        ],
        "solution": """data=list(map(int,open(0).read().split()))
n,t=data[0],data[1]; a=sorted(data[2:])
best=a[0]+a[1]+a[2]
for i in range(n):
    lo,hi=i+1,n-1
    while lo<hi:
        s=a[i]+a[lo]+a[hi]
        if abs(s-t)<abs(best-t): best=s
        if s<t: lo+=1
        elif s>t: hi-=1
        else: print(s); raise SystemExit
print(best)
""",
    },
    {
        "title": "Sort Colors (Dutch Flag)",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Given an array with n objects colored red(0), white(1), or blue(2), sort them in-place so that objects of the same color are adjacent in order 0,1,2.",
        "constraints": "1 <= n <= 300\nnums[i] in {0,1,2}",
        "input_format": "First line: n\nSecond line: n integers",
        "output_format": "Sorted array",
        "examples": [{"input": "6\n2 0 2 1 1 0", "output": "0 0 1 1 2 2", "explanation": ""}],
        "tests": [
            {"input": "6\n2 0 2 1 1 0", "output": "0 0 1 1 2 2", "sample": True},
            {"input": "3\n2 0 1", "output": "0 1 2", "sample": True},
            {"input": "1\n1", "output": "1", "sample": False},
        ],
        "solution": "n=int(input()); a=list(map(int,input().split())); print(' '.join(map(str,sorted(a))))\n",
    },
    {
        "title": "Product of Array Except Self",
        "difficulty": "medium",
        "category": "arrays",
        "description": "Given an array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i].\n\nSolve without using division.",
        "constraints": "2 <= n <= 10^5\n-30 <= nums[i] <= 30",
        "input_format": "First line: n\nSecond line: n integers",
        "output_format": "n integers",
        "examples": [{"input": "4\n1 2 3 4", "output": "24 12 8 6", "explanation": ""}],
        "tests": [
            {"input": "4\n1 2 3 4", "output": "24 12 8 6", "sample": True},
            {"input": "2\n-1 1", "output": "1 -1", "sample": True},
            {"input": "5\n1 1 1 1 1", "output": "1 1 1 1 1", "sample": False},
        ],
        "solution": """n=int(input()); a=list(map(int,input().split()))
out=[1]*n; pref=1
for i in range(n):
    out[i]=pref; pref*=a[i]
suf=1
for i in range(n-1,-1,-1):
    out[i]*=suf; suf*=a[i]
print(' '.join(map(str,out)))
""",
    },
    {
        "title": "Climbing Stairs",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        "constraints": "1 <= n <= 45",
        "input_format": "Integer n",
        "output_format": "Number of ways",
        "examples": [{"input": "3", "output": "3", "explanation": ""}],
        "tests": [
            {"input": "2", "output": "2", "sample": True},
            {"input": "3", "output": "3", "sample": True},
            {"input": "10", "output": "89", "sample": False},
        ],
        "solution": """n=int(input())
if n<=2: print(n); raise SystemExit
a,b=1,2
for _ in range(3,n+1):
    a,b=b,a+b
print(b)
""",
    },
    {
        "title": "Coin Change",
        "difficulty": "medium",
        "category": "dynamic-programming",
        "description": "You are given coins of different denominations and a total amount. Return the fewest number of coins needed to make up that amount. If impossible, return -1.",
        "constraints": "1 <= coins.length <= 12\n1 <= amount <= 10^4",
        "input_format": "First line: n amount\nSecond line: n coin denominations",
        "output_format": "Minimum coins or -1",
        "examples": [{"input": "3 11\n1 2 5", "output": "3", "explanation": "5+5+1"}],
        "tests": [
            {"input": "3 11\n1 2 5", "output": "3", "sample": True},
            {"input": "1 3\n2", "output": "-1", "sample": True},
            {"input": "1 0\n1", "output": "0", "sample": False},
        ],
        "solution": """data=list(map(int,open(0).read().split()))
n,amount=data[0],data[1]; coins=data[2:]
INF=10**9; dp=[0]+[INF]*amount
for a in range(1,amount+1):
    for c in coins:
        if c<=a: dp[a]=min(dp[a], dp[a-c]+1)
print(dp[amount] if dp[amount]<INF else -1)
""",
    },
    {
        "title": "Validate Binary Search Tree Values",
        "difficulty": "medium",
        "category": "data-structures",
        "description": "Given an array representing level-order of a binary tree (null as -1), determine if it is a valid BST (all left < node < all right). For simplicity, the input is an inorder sequence — print true if strictly increasing.",
        "constraints": "1 <= n <= 10^4",
        "input_format": "First line: n\nSecond line: n integers (inorder values)",
        "output_format": "true or false",
        "examples": [{"input": "3\n1 2 3", "output": "true", "explanation": ""}],
        "tests": [
            {"input": "3\n1 2 3", "output": "true", "sample": True},
            {"input": "3\n3 2 1", "output": "false", "sample": True},
            {"input": "1\n1", "output": "true", "sample": False},
        ],
        "solution": """n=int(input()); a=list(map(int,input().split()))
print('true' if all(a[i]<a[i+1] for i in range(n-1)) else 'false')
""",
    },
    {
        "title": "Kth Largest Element",
        "difficulty": "medium",
        "category": "sorting",
        "description": "Given an integer array nums and an integer k, return the k-th largest element in the array.",
        "constraints": "1 <= k <= n <= 10^5",
        "input_format": "First line: n k\nSecond line: n integers",
        "output_format": "The k-th largest element",
        "examples": [{"input": "6 2\n3 2 1 5 6 4", "output": "5", "explanation": ""}],
        "tests": [
            {"input": "6 2\n3 2 1 5 6 4", "output": "5", "sample": True},
            {"input": "9 4\n3 2 3 1 2 4 5 5 6", "output": "4", "sample": True},
            {"input": "1 1\n1", "output": "1", "sample": False},
        ],
        "solution": "n,k=map(int,input().split()); a=sorted(map(int,input().split()), reverse=True); print(a[k-1])\n",
    },
    {
        "title": "Number of Islands (Grid)",
        "difficulty": "medium",
        "category": "graphs",
        "description": "Given an m x n 2D binary grid which represents a map of '1' (land) and '0' (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
        "constraints": "1 <= m,n <= 50",
        "input_format": "First line: m n\nNext m lines: n characters (0/1) without spaces",
        "output_format": "Number of islands",
        "examples": [{"input": "4 5\n11110\n11010\n11000\n00000", "output": "1", "explanation": ""}],
        "tests": [
            {"input": "4 5\n11110\n11010\n11000\n00000", "output": "1", "sample": True},
            {"input": "4 5\n11000\n11000\n00100\n00011", "output": "3", "sample": True},
            {"input": "1 1\n0", "output": "0", "sample": False},
        ],
        "solution": """import sys
sys.setrecursionlimit(10000)
m,n=map(int,input().split())
g=[list(input().strip()) for _ in range(m)]
def dfs(i,j):
    if i<0 or j<0 or i>=m or j>=n or g[i][j]!='1': return
    g[i][j]='0'
    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)
cnt=0
for i in range(m):
    for j in range(n):
        if g[i][j]=='1':
            dfs(i,j); cnt+=1
print(cnt)
""",
    },
    {
        "title": "Generate Parentheses",
        "difficulty": "medium",
        "category": "recursion",
        "description": "Given n pairs of parentheses, generate all combinations of well-formed parentheses. Print them sorted lexicographically, one per line.",
        "constraints": "1 <= n <= 8",
        "input_format": "Integer n",
        "output_format": "All combinations, one per line, sorted",
        "examples": [{"input": "2", "output": "(())\n()()", "explanation": ""}],
        "tests": [
            {"input": "1", "output": "()", "sample": True},
            {"input": "2", "output": "(())\n()()", "sample": True},
            {"input": "3", "output": "((()))\n(()())\n(())()\n()(())\n()()()", "sample": False},
        ],
        "solution": """n=int(input()); out=[]
def bt(s,o,c):
    if len(s)==2*n: out.append(s); return
    if o<n: bt(s+'(',o+1,c)
    if c<o: bt(s+')',o,c+1)
bt('',0,0)
print('\\n'.join(sorted(out)))
""",
    },
    {
        "title": "Rotate Array",
        "difficulty": "medium",
        "category": "arrays",
        "description": "Given an array, rotate the array to the right by k steps, where k is non-negative.",
        "constraints": "1 <= n <= 10^5\n0 <= k <= 10^5",
        "input_format": "First line: n k\nSecond line: n integers",
        "output_format": "Rotated array",
        "examples": [{"input": "7 3\n1 2 3 4 5 6 7", "output": "5 6 7 1 2 3 4", "explanation": ""}],
        "tests": [
            {"input": "7 3\n1 2 3 4 5 6 7", "output": "5 6 7 1 2 3 4", "sample": True},
            {"input": "4 2\n-1 -100 3 99", "output": "3 99 -1 -100", "sample": True},
            {"input": "1 0\n1", "output": "1", "sample": False},
        ],
        "solution": "n,k=map(int,input().split()); a=list(map(int,input().split())); k%=n; a=a[-k:]+a[:-k] if k else a; print(' '.join(map(str,a)))\n",
    },
    {
        "title": "Search in Rotated Sorted Array",
        "difficulty": "medium",
        "category": "searching",
        "description": "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated. Given the array and target, return the index of target or -1.",
        "constraints": "1 <= n <= 5000",
        "input_format": "First line: n target\nSecond line: n integers",
        "output_format": "Index or -1",
        "examples": [{"input": "7 0\n4 5 6 7 0 1 2", "output": "4", "explanation": ""}],
        "tests": [
            {"input": "7 0\n4 5 6 7 0 1 2", "output": "4", "sample": True},
            {"input": "7 3\n4 5 6 7 0 1 2", "output": "-1", "sample": True},
            {"input": "1 0\n1", "output": "-1", "sample": False},
        ],
        "solution": """data=list(map(int,open(0).read().split()))
n,t=data[0],data[1]; a=data[2:]
lo,hi=0,n-1; ans=-1
while lo<=hi:
    mid=(lo+hi)//2
    if a[mid]==t: ans=mid; break
    if a[lo]<=a[mid]:
        if a[lo]<=t<a[mid]: hi=mid-1
        else: lo=mid+1
    else:
        if a[mid]<t<=a[hi]: lo=mid+1
        else: hi=mid-1
print(ans)
""",
    },
    # ========== HARD (8) ==========
    {
        "title": "Median of Two Sorted Arrays",
        "difficulty": "hard",
        "category": "arrays",
        "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. Overall run time complexity should be O(log (m+n)).",
        "constraints": "0 <= m,n <= 1000\nm+n >= 1",
        "input_format": "First line: m n\nSecond line: m integers\nThird line: n integers",
        "output_format": "Median as float with 1 decimal if needed, else integer-like (e.g. 2.0)",
        "examples": [{"input": "2 1\n1 3\n2", "output": "2.0", "explanation": ""}],
        "tests": [
            {"input": "2 1\n1 3\n2", "output": "2.0", "sample": True},
            {"input": "2 2\n1 2\n3 4", "output": "2.5", "sample": True},
            {"input": "1 0\n5", "output": "5.0", "sample": False},
        ],
        "solution": """import sys
raw = sys.stdin.read().strip().split()
m, n = int(raw[0]), int(raw[1])
nums = list(map(int, raw[2:]))
a, b = nums[:m], nums[m:m+n]
merged = sorted(a + b)
L = len(merged)
med = float(merged[L // 2]) if L % 2 else (merged[L // 2 - 1] + merged[L // 2]) / 2
print(f'{med:.1f}')
""",
    },
    {
        "title": "N-Queens Count",
        "difficulty": "hard",
        "category": "recursion",
        "description": "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return the number of distinct solutions.",
        "constraints": "1 <= n <= 9",
        "input_format": "Integer n",
        "output_format": "Number of solutions",
        "examples": [{"input": "4", "output": "2", "explanation": ""}],
        "tests": [
            {"input": "4", "output": "2", "sample": True},
            {"input": "1", "output": "1", "sample": True},
            {"input": "8", "output": "92", "sample": False},
        ],
        "solution": """n=int(input()); ans=0
cols=set(); d1=set(); d2=set()
def bt(r):
    global ans
    if r==n: ans+=1; return
    for c in range(n):
        if c in cols or r-c in d1 or r+c in d2: continue
        cols.add(c); d1.add(r-c); d2.add(r+c)
        bt(r+1)
        cols.remove(c); d1.remove(r-c); d2.remove(r+c)
bt(0); print(ans)
""",
    },
    {
        "title": "Word Ladder Length",
        "difficulty": "hard",
        "category": "graphs",
        "description": "Given two words beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists. Each transformed word must exist in the word list, and each transformation changes exactly one letter.",
        "constraints": "1 <= wordList.length <= 500\nbeginWord != endWord",
        "input_format": "First line: beginWord endWord\nSecond line: k\nNext k lines: dictionary words",
        "output_format": "Length of shortest transformation (including begin)",
        "examples": [{"input": "hit cog\n6\nhot\ndot\ndog\nlot\nlog\ncog", "output": "5", "explanation": "hit->hot->dot->dog->cog"}],
        "tests": [
            {"input": "hit cog\n6\nhot\ndot\ndog\nlot\nlog\ncog", "output": "5", "sample": True},
            {"input": "hit cog\n5\nhot\ndot\ndog\nlot\nlog", "output": "0", "sample": True},
            {"input": "a c\n3\na\nb\nc", "output": "2", "sample": False},
        ],
        "solution": """from collections import deque
begin,end=input().split(); k=int(input()); words=[input().strip() for _ in range(k)]
if end not in words: print(0); raise SystemExit
wordset=set(words); q=deque([(begin,1)]); seen={begin}
while q:
    w,d=q.popleft()
    if w==end: print(d); raise SystemExit
    for i in range(len(w)):
        for c in 'abcdefghijklmnopqrstuvwxyz':
            nw=w[:i]+c+w[i+1:]
            if nw in wordset and nw not in seen:
                seen.add(nw); q.append((nw,d+1))
print(0)
""",
    },
    {
        "title": "Longest Increasing Subsequence",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
        "constraints": "1 <= n <= 2500",
        "input_format": "First line: n\nSecond line: n integers",
        "output_format": "LIS length",
        "examples": [{"input": "8\n10 9 2 5 3 7 101 18", "output": "4", "explanation": "2,3,7,101"}],
        "tests": [
            {"input": "8\n10 9 2 5 3 7 101 18", "output": "4", "sample": True},
            {"input": "6\n0 1 0 3 2 3", "output": "4", "sample": True},
            {"input": "1\n7", "output": "1", "sample": False},
        ],
        "solution": """import bisect
n=int(input()); a=list(map(int,input().split())); tails=[]
for x in a:
    i=bisect.bisect_left(tails,x)
    if i==len(tails): tails.append(x)
    else: tails[i]=x
print(len(tails))
""",
    },
    {
        "title": "Trapping Rain Water",
        "difficulty": "hard",
        "category": "algorithms",
        "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        "constraints": "1 <= n <= 2*10^4\n0 <= height[i] <= 10^5",
        "input_format": "First line: n\nSecond line: n integers",
        "output_format": "Units of trapped water",
        "examples": [{"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6", "explanation": ""}],
        "tests": [
            {"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6", "sample": True},
            {"input": "6\n4 2 0 3 2 5", "output": "9", "sample": True},
            {"input": "3\n1 0 1", "output": "1", "sample": False},
        ],
        "solution": """n=int(input()); h=list(map(int,input().split()))
L=[0]*n; R=[0]*n; L[0]=h[0]; R[-1]=h[-1]
for i in range(1,n): L[i]=max(L[i-1],h[i])
for i in range(n-2,-1,-1): R[i]=max(R[i+1],h[i])
print(sum(min(L[i],R[i])-h[i] for i in range(n)))
""",
    },
    {
        "title": "Edit Distance",
        "difficulty": "hard",
        "category": "dynamic-programming",
        "description": "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You can insert, delete, or replace a character.",
        "constraints": "0 <= word1.length, word2.length <= 500",
        "input_format": "Two lines: word1 and word2",
        "output_format": "Minimum edit distance",
        "examples": [{"input": "horse\nros", "output": "3", "explanation": ""}],
        "tests": [
            {"input": "horse\nros", "output": "3", "sample": True},
            {"input": "intention\nexecution", "output": "5", "sample": True},
            {"input": "a\nb", "output": "1", "sample": False},
        ],
        "solution": """a=input().strip(); b=input().strip()
m,n=len(a),len(b)
dp=[[0]*(n+1) for _ in range(m+1)]
for i in range(m+1): dp[i][0]=i
for j in range(n+1): dp[0][j]=j
for i in range(1,m+1):
    for j in range(1,n+1):
        if a[i-1]==b[j-1]: dp[i][j]=dp[i-1][j-1]
        else: dp[i][j]=1+min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1])
print(dp[m][n])
""",
    },
    {
        "title": "Serialize Course Prerequisites (Topo)",
        "difficulty": "hard",
        "category": "graphs",
        "description": "There are numCourses courses labeled from 0 to numCourses-1. You are given prerequisites where prerequisites[i] = [ai, bi] indicates you must take course bi first. Return true if you can finish all courses, else false.",
        "constraints": "1 <= numCourses <= 2000",
        "input_format": "First line: numCourses m\nNext m lines: ai bi",
        "output_format": "true or false",
        "examples": [{"input": "2 1\n1 0", "output": "true", "explanation": ""}],
        "tests": [
            {"input": "2 1\n1 0", "output": "true", "sample": True},
            {"input": "2 2\n1 0\n0 1", "output": "false", "sample": True},
            {"input": "1 0", "output": "true", "sample": False},
        ],
        "solution": """from collections import defaultdict, deque
import sys
lines=sys.stdin.read().strip().splitlines()
num,m=map(int,lines[0].split())
indeg=[0]*num; g=defaultdict(list)
for i in range(1,m+1):
    a,b=map(int,lines[i].split()); g[b].append(a); indeg[a]+=1
q=deque([i for i in range(num) if indeg[i]==0]); seen=0
while q:
    u=q.popleft(); seen+=1
    for v in g[u]:
        indeg[v]-=1
        if indeg[v]==0: q.append(v)
print('true' if seen==num else 'false')
""",
    },
    {
        "title": "Maximum Path Sum in Triangle",
        "difficulty": "hard",
        "category": "algorithms",
        "description": "Given a triangle array, return the minimum path sum from top to bottom. At each step you may move to an adjacent number on the row below.",
        "constraints": "1 <= rows <= 200",
        "input_format": "First line: r\nNext r lines: i+1 integers for row i",
        "output_format": "Minimum path sum",
        "examples": [{"input": "4\n2\n3 4\n6 5 7\n4 1 8 3", "output": "11", "explanation": "2+3+5+1"}],
        "tests": [
            {"input": "4\n2\n3 4\n6 5 7\n4 1 8 3", "output": "11", "sample": True},
            {"input": "1\n-10", "output": "-10", "sample": True},
            {"input": "2\n1\n2 3", "output": "3", "sample": False},
        ],
        "solution": """r=int(input()); t=[list(map(int,input().split())) for _ in range(r)]
dp=t[-1][:]
for i in range(r-2,-1,-1):
    for j in range(i+1):
        dp[j]=t[i][j]+min(dp[j],dp[j+1])
print(dp[0])
""",
    },
]
