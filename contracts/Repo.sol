pragma solidity ^0.4.24;

contract Repo {

	string public name;
	string public software;
	uint public lastUpdated;

	function Repo(string _name) {
		name = _name;
	}

	function update(string _software) {
		software = _software;
	}
}