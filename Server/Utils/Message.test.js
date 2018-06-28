var expect = require('expect');

var {generateMessage} = require('./Message');

describe('generateMessage',()=>{
   it('Should generate correct object', () => {
       var from='Abhi';
       var text='Some Message';
       var message = generateMessage(from, text);
       expect(message.createdAt).toBeA('number');
       expect(message).toInclude({from,text});
   });
});