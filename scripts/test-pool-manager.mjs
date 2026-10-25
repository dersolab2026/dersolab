import {
  getBooksPool,
  getAvailableBooks,
  getPoolStats,
  pickNextBookPair,
  pickNextSingleBook,
  markBookAsUsed,
  resetUsedPool,
  isBookUsed,
  BLACKLISTED_BOOKS,
} from '../src/lib/social/bookPoolManager.ts'

console.log('--- TESTING BOOK POOL MANAGER ---')

// 1. Initial counts
const initialStats = getPoolStats()
console.log('1. Initial stats:', initialStats)
if (initialStats.ortaokul.total !== 1000 || initialStats.lise.total !== 1000) {
  throw new Error('Total books count mismatch!');
}

// 2. Pick next pair
const pair1 = pickNextBookPair('', 1, true)
console.log('2. Picked pair 1:', {
  ortaokul: `${pair1.ortaokul.id} - ${pair1.ortaokul.title} (${pair1.ortaokul.author})`,
  lise: `${pair1.lise.id} - ${pair1.lise.title} (${pair1.lise.author})`,
})

const statsAfterPair1 = getPoolStats()
console.log('3. Stats after pair 1:', statsAfterPair1)
if (statsAfterPair1.ortaokul.used < 1 || statsAfterPair1.lise.used < 1) {
  throw new Error('Used books count did not increment!');
}

// 3. Pick next pair again (must be different)
const pair2 = pickNextBookPair('', 2, true)
console.log('4. Picked pair 2:', {
  ortaokul: `${pair2.ortaokul.id} - ${pair2.ortaokul.title} (${pair2.ortaokul.author})`,
  lise: `${pair2.lise.id} - ${pair2.lise.title} (${pair2.lise.author})`,
})

if (pair1.ortaokul.id === pair2.ortaokul.id) {
  throw new Error('Ortaokul book was repeated!');
}
if (pair1.lise.id === pair2.lise.id) {
  throw new Error('Lise book was repeated!');
}

// 4. Verify blacklisted books are rejected
for (const bl of BLACKLISTED_BOOKS) {
  if (!isBookUsed({ title: bl })) {
    throw new Error(`Blacklisted book was not blocked: ${bl}`)
  }
}
console.log('5. Verified all blacklisted books are automatically marked as blocked/used.')

// 5. Test single book pick
const singleOrt = pickNextSingleBook('ortaokul', true)
console.log('6. Picked single Ortaokul book:', singleOrt.id, singleOrt.title)
if (singleOrt.id === pair1.ortaokul.id || singleOrt.id === pair2.ortaokul.id) {
  throw new Error('Single pick returned an already used book!');
}

console.log('--- ALL POOL TESTS PASSED PERFECTLY! ---')
