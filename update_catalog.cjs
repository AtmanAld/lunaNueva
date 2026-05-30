const fs = require('fs');
const path = require('path');

const filePath = path.join('C:\\Users\\ameli\\.gemini\\antigravity\\scratch\\luna-nueva\\src\\data\\spiralCatalog.js');
let content = fs.readFileSync(filePath, 'utf8');

const p2Keys = [
  'THANKS_FOOD', 'THANKS_WATER', 'THANKS_WASH', 'THANKS_PLAY',
  'CONFIRM_WATER', 'CONFIRM_FOOD', 'CONFIRM_WASH', 'CONFIRM_PLAY',
  'ACTIVITY_COMPLETE_SINGLE', 'ACTIVITY_CANCEL_SINGLE', 'ACTIVITY_COMPLETE_MULTIPLE', 'ACTIVITY_CANCEL_MULTIPLE',
  'NO_NEED_WATER', 'NO_NEED_FOOD', 'NO_NEED_WASH', 'NO_NEED_PLAY',
  'ALBUM_PLACE_CARD', 'ALBUM_UNLOCK_SLOT_WITH_ITEM', 'ALBUM_UNLOCK_SLOT_NO_ITEM', 'ALBUM_UNLOCK_PAGE_WITH_ITEM', 'ALBUM_UNLOCK_PAGE_NO_ITEM',
  'ALBUM_PAGE_FULL_OFFER', 'ALBUM_PAGE_COMPLETE_EXCHANGE',
  'STORE_BUY_ACTIVITY', 'STORE_ACTIVITY_DETAIL', 'STORE_ACTIVITY_BOUGHT', 'STORE_NOT_ENOUGH_STARS', 'STORE_BUY_ITEM',
  'PROFILE_EDIT_AVATAR', 'PROFILE_EDIT_NAMES',
  'IDLE_REWARDS',
  'WRONG_PENTAGRAM_GUESS',
  'NEW_DAY_PROMPT',
  'REVIEW_DAY_WAITING'
];

const p3Keys = [
  'REWARD_LUNA_CRECIENTE', 'REWARD_LUNA_CUARTO_CRECIENTE', 'REWARD_LUNA_GIBOSA_CRECIENTE',
  'DASHBOARD_FULL_MOON',
  'MOON_DUST_USED',
  'PHASE_CHANGE',
  'MOON_REWARD_CLAIMED', 'MOON_REWARD_CLAIMED_NEW',
  'GO_TO_STORE_NO_ITEM',
  'SPIRAL_GIFT_STARS',
  'ALBUM_PAGE_COMPLETE_LOCK',
  'PENDING_PLACEMENT_WARNING'
];

let changed = false;

p2Keys.forEach(key => {
  const regex = new RegExp(`("${key}":\\s*{)`, 'g');
  if (content.match(regex) && !content.match(new RegExp(`"${key}":\\s*{\\s*priority: 2`))) {
    content = content.replace(regex, `$1\n    priority: 2,`);
    changed = true;
  }
});

p3Keys.forEach(key => {
  const regex = new RegExp(`("${key}":\\s*{)`, 'g');
  if (content.match(regex) && !content.match(new RegExp(`"${key}":\\s*{\\s*priority: 3`))) {
    content = content.replace(regex, `$1\n    priority: 3,`);
    changed = true;
  }
});

if (changed) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('spiralCatalog.js updated successfully.');
} else {
  console.log('spiralCatalog.js already had priorities or no matches.');
}
