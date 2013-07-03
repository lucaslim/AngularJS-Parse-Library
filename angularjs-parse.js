/**
 * AngularJS Parse Library
 *
 * Parse Library for AngularJS
 *
 * View the readme at https://github.com/lucaslim/AngularJS-Parse-Library
 *
 * @version 1.0
 * @author  Lucas Lim
 * @website http://www.codeopolis.com
 *
 */

// --------------------------------------------------------------------

/**
 * Parse Application ID
 *
 * Enter your Application ID
 */

var applicationKey = '';

// --------------------------------------------------------------------

/**
 * Parse REST API Key
 *
 * Enter your REST API Key
 */

var apiKey = '';

// --------------------------------------------------------------------

angular.module('parseService', [])

.service('parse', ['$http', '$window',
  function($http, $window) {
		var self = this;
		var storage = $window.localStorage;
		var domain = 'https://api.parse.com';
		var version = 1;
		var baseUrl = domain + '/' + version;

		this._setStorage = function(obj) {
			angular.forEach(obj, function(v, i) {
				storage.setItem(i, v);
			});
		}

		this._getStorage = function(key) {
			return storage.getItem(key);
		}

		this._removeStorage = function(key) {
			storage.removeItem(key);
		}

		this.request = function(method, path, data, params) {
			//set header
			headers = {
				"X-Parse-Application-Id": applicationKey,
				"X-Parse-REST-API-KEY": apiKey,
				"Content-Type": "application/json"
			};

			if (self._getStorage('PARSE_SESSION_TOKEN') != null) {
				headers["X-Parse-Session-Token"] = self._getStorage('PARSE_SESSION_TOKEN');
			}

			return $http({
				method: method,
				url: baseUrl + path,
				data: data,
				params: params,
				headers: headers
			});
		}

		this.select = function(className) {
			return self.request("GET", '/classes/' + className).then(function(response) {
				return {
					success: response.status == 200,
					data: response.data
				};
			});
		};

		this.selectByParam = function(className, params) {
			return self.request("GET", '/classes/' + className, null, {
				"where": params
			}).then(function(response) {
				return {
					success: response.status == 200,
					data: response.data
				};
			});
		}

		this.insert = function(className, data) {
			return self.request("POST", '/classes/' + className, data).then(function(response) {
				return {
					success: response.status == 201,
					createdAt: response.data.createdAt,
					returnId: response.data.objectId
				};
			});
		}

		this.delete = function(className, id) {
			return self.request("DELETE", '/classes/' + className + '/' + id).then(function(response) {
				return {
					success: response.status == 200
				};
			});
		}

		this.update = function(className, id, data) {
			return self.request("PUT", '/classes/' + className + '/' + id, data).then(function(response) {
				return {
					success: response.status == 200,
					updatedAt: response.data.updatedAt
				};
			});
		}

		this.signup = function(data) {
			return self.request("POST", '/users', data).then(function(response) {
				return {
					success: response.status == 201,
					createdAt: response.data.createdAt,
					returnId: response.data.objectId
				};
			});
		}

		this.login = function(username, password) {
			return self.request("GET", '/login', null, {
				username: username,
				password: password
			}).then(function(response) {
				self._setStorage({
					'PARSE_SESSION_TOKEN': response.data.sessionToken
				})
				return {
					success: response.status == 200,
					data: response.data
				};
			});
		}

		this.logout = function() {
			self._removeStorage('PARSE_SESSION_TOKEN');
		}

		this.reset = function(email) {
			return self.request("POST", '/requestPasswordReset', {
				email: email
			}).then(function(response) {
				return {
					success: response.status == 200
				};
			});
		}

		this.getUser = function() {
			return self.request("GET", '/users').then(function(response) {
				return {
					success: response.status == 200,
					data: response.data.results
				};
			});
		}

		this.getUserByParam = function(params) {
			return self.request("GET", '/users', null, {
				where: params
			}).then(function(response) {
				return {
					success: response.status == 200,
					data: response.data.results
				};
			});
		}

		this.getUserById = function(id) {
			return self.request("GET", '/users/' + id).then(function(response) {
				return {
					success: response.status == 200,
					data: response.data
				};
			});
		};

		this.updateUser = function(id, data) {
			return self.request("PUT", '/users/' + id, data).then(function(response) {
				return {
					success: response.status == 200,
					updatedAt: response.data.updatedAt
				};
			});
		}

		this.deleteUser = function(id) {
			return self.request("DELETE", '/users/' + id).then(function(response) {
				return {
					success: response.status == 200
				};
			});
		}
	}
]);
