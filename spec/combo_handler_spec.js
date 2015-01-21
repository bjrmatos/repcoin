process.env.NODE_ENV = 'test';
var winston = require('winston');

var ComboHandler = require('../api/handlers/combo.js');
var JoinEvent = require('../api/models/JoinEvent.js');
var Transaction = require('../api/models/Transaction.js');

describe('ComboHandler: ', function() {
  var req, res;
  beforeEach(function() {
    spyOn(winston, 'log').andCallFake(function(arg1, arg2, arg3, arg4) {
      return;
    });

    req = {
      query: {},
      params: {},
      body: {},
      session: {}
    };

    res = {
      status: jasmine.createSpy().andCallFake(function(msg) {
        return this;
      }),
      send: jasmine.createSpy().andCallFake(function(msg) {
        return this;
      }),
      login: jasmine.createSpy().andCallFake(function(user) {
        return user;
      }),
      end: jasmine.createSpy()
    };
  });

  afterEach(function() {
    expect(res.status.callCount).toEqual(1);
    expect(res.send.callCount).toEqual(1);
  });

  describe('feedItems: ', function() {
    beforeEach(function() {
      transactionPromise = {
        t1: {
          timeStamp: new Date('1992')
        },

        t2: {
          timeStamp: new Date('1994')
        },

        then: function(cb) {
          return cb([this.t1, this.t2]);
        }
      };

      joinEventPromise = {
        e1: {
          timeStamp: new Date('1993')
        },

        then: function(cb) {
          return cb([this.e1]);
        }
      };

    });

    describe('get: ', function() {
      it('should sort the items in order of timestamp', function() {
        spyOn(Transaction, 'findPublic').andReturn(transactionPromise);
        spyOn(JoinEvent, 'find').andReturn({
          exec: function() { return joinEventPromise; }
        });
        ComboHandler.feedItems.get(req, res);
        expect(res.send).toHaveBeenCalledWith([
          { timeStamp: new Date('1992') }, { timeStamp: new Date('1993') },
          { timeStamp: new Date('1994') }]);
      });

      it('should log an error when the transaction find fails', function() {
        spyOn(Transaction, 'findPublic').andReturn({
          then: function(cbS, cbF) { return cbF('failure!'); }
        });
        ComboHandler.feedItems.get(req, res);

        expect(res.status).toHaveBeenCalledWith(503);
        expect(res.send).toHaveBeenCalledWith('failure!');
      });

      it('should log an error when the join event find fails', function() {
        spyOn(Transaction, 'findPublic').andReturn(transactionPromise);
        spyOn(JoinEvent, 'find').andReturn({
          exec: function() {
            return {
              then: function(cbS, cbF) { return cbF('failure!'); }
            };
          }
        });
        ComboHandler.feedItems.get(req, res);

        expect(res.status).toHaveBeenCalledWith(503);
        expect(res.send).toHaveBeenCalledWith('failure!');
      });
    });
  });

});
