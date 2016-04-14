(function (app) {
    var debug = false;
    app.provider('acestudioRedux', function AcestudioReduxProvider() {

        this.setDebug = function (customDebug) {
            debug = customDebug;
        };

        this.$get = [function acestudioReduxLauncher() {
            return new AcestudioReduxProvider(debug)
        }];
    });


    app.service('aceredux', function () {
        var globalStore = {};
        window.acestudioReduxGlobalStore = globalStore;
        var _reducers = {};
        var listeners = {};
        var stores = [];
        var globalStoreName = '';
        return function CreateStore(storeName, reducers, $scope, isGlobal) {
            if (isGlobal) {
                globalStoreName = storeName;
            }
            if (!_.has($scope, 'store')) {
                $scope.store = {};
            }
            globalStore[storeName] = _.assign({}, $scope.store);
            if (!!~stores.indexOf(storeName)) {
                console.error(storeName, ' - already included');
            }

            listeners[storeName] = function storeWasChanged(newState) {
                $scope.store = _.assign({}, globalStore[storeName]);
            };

            _.forEach(reducers || {}, function (value, key) {
                _reducers[storeName + '.' + key] = value;
            });
            angular.extend(_reducers, reducers);

            function $reducer(cb, value, eventName, specStore) {
                var state = _.assign({}, globalStore);
                var store = cb(state[specStore || storeName] || {}, value);
                globalStore[specStore || storeName] = store;
                listeners[specStore || storeName](store);
            }

            function $logEvent(eventName, value) {
                if (debug) {
                    if (value === undefined) {
                        console.warn('ACTION: ' + eventName, 'undefined value');
                    }
                    console.trace([
                            '%c ACTION: ', '%c ', eventName, '\n',
                            '%c TIME: %c', new Date(), ' \n',
                            '%c VALUE: %c ',
                            ''
                        ].join(''),
                        'color:green', 'color:#0000ff',
                        'color:green', 'color:#0000ff',
                        'color:green', 'color:#0000ff', value);
                }
            }

            function $_$dispatch(srcEventName, value, global) {
                var eventName = (global || storeName) + '.' + srcEventName;
                var reducer = _reducers[eventName];
                if (reducer instanceof Function) {
                    $logEvent(eventName, value);
                    $reducer(reducer, value, eventName, global);
                } else if (typeof(reducer) === 'string') {
                    $logEvent(eventName, value);
                    $reducer(function (store, value) {
                        _.set(store, reducer, value);
                        return store;
                    }, value, eventName, global);
                } else {
                    if (global) {
                        console.error('Reducer ' + eventName + ' not found');
                    } else {
                        $_$dispatch(srcEventName, value, globalStoreName || 'App');
                    }
                }


            }

            return {
                get: function get(what, from) {
                    return _.get(globalStore[from || storeName], what);
                },
                $d: function $dispatch(srcEventName, value, specStore) {
                    if (srcEventName instanceof Object) {
                        _.forEach(srcEventName, function (value, event) {
                            $_$dispatch(event, value, specStore);
                        }.bind(this));
                    } else {
                        $_$dispatch(srcEventName, value, specStore);
                    }

                }
            };
        };
    });
})(angular.module('acestudio-redux', []));