export default {
	loadWords,
	findWords,
};

// ****************************

let dict = {};
let isWord = Symbol("is-word");
function loadWords(wordList) {
	var nodeCount = 0;

	// reset a previously loaded dictionary?
	if (Object.keys(dict).length > 0) {
		dict = {};
	}

	// construct the dictionary as a trie
	for (let word of wordList) {
		// traverse down the trie (from the root), creating nodes
		// as necessary
		let node = dict;
		for (let letter of word) {
			if (!node[letter]) {
				node[letter] = {
					[isWord]: false,
				};
				nodeCount++;
			}
			node = node[letter];
		}

		// mark the terminal node for this word
		node[isWord] = true;
	}

	return nodeCount;
}

function findWords(input, prefix = "", node = dict, words = new Set()) {
	// is the current node the end of a valid word?
	if (node[isWord]) {
		words.add(prefix);
	}

	for (let i = 0; i < input.length; i++) {
		let currentLetter = input[i];

		// does the current (sub)trie have a node for this letter?
		if (node[currentLetter]) {
			let remainingLetters = [
				...input.slice(0, i),
				...input.slice(i + 1),
			];
			findWords(
				remainingLetters,
				prefix + currentLetter,
				node[currentLetter],
				words
			);
		}
	}

	if (node == dict) {
		words = Array.from(words);
	}
	return words;
}

function checkWord(word, input) {
	return permute("", input);

	// *************************

	// permute the input letters (k! variations)
	function permute(prefix, remaining) {
		for (let i = 0; i < remaining.length; i++) {
			let current = prefix + remaining[i];

			// found a permutation that matched?
			if (current == word) {
				return true;
			} else if (
				// any remaining input letters to permute and concat?
				remaining.length > 1 &&
				// current string shorter than the target word?
				current.length < word.length
			) {
				// check all the permuted remaining letters
				if (
					permute(
						current,
						remaining.slice(0, i) + remaining.slice(i + 1)
					)
				) {
					// propagate the match-found signal back up the
					// recursion chain
					return true;
				}
			}
		}

		return false;
	}
}
