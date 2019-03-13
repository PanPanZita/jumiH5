define([], function() {

	//获取地址连接的各种数据
	var localSearch = function() {
		var _href = location.href,
			_host = location.host,
			_hostname = location.hostname,
			_pathname = location.pathname,
			_port = location.port,
			_protocol = location.protocol,
			_searchTotal = _search = location.search,
			arr = [],
			innerpara = {};
		_searchTotal = (_searchTotal.indexOf("?") >= 0) ? _searchTotal.substring(1) : _searchTotal;
		_search = (_search.indexOf("?") >= 0) ? _search.substring(1) : _search;
		if (_search.indexOf("&") >= 0) {
			_search = _search.split("&");
			_len = _search.length;
			for (var i = 0; i < _len; i++) {
				var item = _search[i];
				item = item.indexOf("=") >= 0 ? item.split("=") : "";
				innerpara[item[0]] = item[1];
			}
		} else {
			var item = _search.indexOf("=") >= 0 ? _search.split("=") : "";
			innerpara[item[0]] = item[1];
		}
		var para = {
			_href: _href,
			_host: _host,
			_hostname: _hostname,
			_pathname: _pathname,
			_port: _port,
			_protocol: _protocol,
			_searchTotal: _searchTotal,
			_search: innerpara
		};
		return para;
	}

	return {
		localSearch: localSearch
	};
});