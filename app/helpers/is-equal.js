import { helper } from '@ember/component/helper';

export default helper(function isEqual([value1, value2]) {
  return value1 === value2;
});
