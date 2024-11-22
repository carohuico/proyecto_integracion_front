import { helper } from '@ember/component/helper';

export default helper(function isEqual([value1, value2]) {
    console.log('Value1:', value1);
    console.log('Value2:', value2);
  return value1 === value2;
});