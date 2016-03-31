/**
 * Created by stbe on 21.03.16.
 */
/**
 * @description Data type for string objects that have many manipulation options
 * @param {string} value The string value of this text
 */
var S_String = function() {
  this.value = '';

  /**
   * @description Sets the value of this object
   * @param {string} s The string whose value is assigned to this object
   */
  this.setValue = function(s) {
    this.value = s;
  };

  /**
   * @description Gets the string value of this object
   * @return {string} The string value of this object
   */
  this.getValue = function() {
    return this.value;
  };

  /**
   * @description Returns an index of a given search String.
   * @param {string} search The string whose index is needed
   * @param {object} [flags] position; occursMin; occursMax; occursExactly; ignoreCase
   * @return {number} the specified index of @search
   */
  this.indexOf = function(search, flags) {
    if(!flags) {
      flags = {position: 'first'}
    }
    var indexFound = -1;		//the position where the wanted index was found, or -1
    var selfFormatted = this.value;
    var occurrences = selfFormatted.match(new RegExp(search, 'g') || []).length;

    if('ignoreCase' in flags) {
      search = search.toLowerCase();
    }

    //execute the actual search
    switch(flags.position) {
      case 'first': indexFound = selfFormatted.indexOf(search); break;
      case 'last': indexFound = selfFormatted.lastIndexOf(search); break;
      default: indexFound = selfFormatted.indexOf(search, flags.position);
    }

    if('occursMin' in flags && occurrences < flags.occursMin) {
      indexFound = -1;
    } else if('occursMax' in flags && occurrences > flags.occursMax) {
      indexFound = -1;
    } else if('occursExactly' in flags && occurrences != flags.occursExactly) {
      indexFound = -1;
    }

    return indexFound;

  };

  /**
   * @description Returns all indexes of a given search string
   * @param {string} search The string whose index is needed
   * @param {object} [flags] [occursMin=%; occursMax=%, occursExactly=%, ignoreCase]
   * @return {number[]} all indexes of @search
   */
  this.allIndexesOf = function(search, flags) {
    if(!flags) {
      flags = {};
    }
    var result = [];
    var lookIndex = 0;
    while(true) {
      //Print "hanging in AllIndexesOf with inner="+lookIndex
      flags.position = lookIndex;
      var currentResult = this.indexOf(search, flags);
      if(currentResult > -1) {
        result.push(currentResult);
        lookIndex = currentResult+1;
      } else {
        break;
      }
    }

    return result;
  };

  /**
   * @description Returns the index range (first and last position) of a search string
   * @param {string} search The string whose index is needed
   * @flags {string} the flags [first; last; inner=%; occursMin=%; occursMax=%; occursExactly=%; ignoreCase]
   * @return {number[]} the specified index range of @search
   */
  this.indexRangeOf = function(search, flags) {
    if(!flags) {
      flags = {position: 'first'};
    }
    var found = this.indexOf(search, flags);
    if(found == -1) {
      return [-1,-1];
    }
    var result = [];
    result.push(found);
    result.push(found + search.length-1);
    return result;
  };


  /**
   * @description Returns all index ranges of a given search string
   * @search The string whose index is needed
   * @flags [occursMin=%; occursMax=%, occursExactly=%]
   * @return all index ranges of @search
   */
  this.allIndexRangesOf = function() {
    //TODO return an array which contains array with 2 elements each
  };

  /**
   * @description Searches for a PatternChain in self
   * @patternChain {S_PatternChain}
   * @flags
   */
  this.search = function(patternChain, flags) {
    if(!flags) {
      flags = {};
    }

    //@TODO
    console.log("pattern chain has "+(patternChain.chain.length)+" elements.");

    var result = new S_Trove();
    for(var i=0; i<patternChain.chain.length; i++) {
      var tempResults = [''];
      var tempAtWhichPositions = [-1];
      //patterns
      if(patternChain.chainTypes[i] == "pattern") {
        var currentPattern = S_Pattern(patternChain.chain[i]);
        var indexes = 0;
        //iterate over all strings in the current pattern
        for(var j=0; j<currentPattern.chain.length; j++) {
          var currentString = currentPattern.chain[j];

          for(var k=0; k<tempResults.length; k++) {
            var stringIndexes = this.allIndexesOf(tempResults[k] + currentPattern.chain[j]);	//append all strings that have already been found at first position
            console.log(tempResults[k] + currentPattern.chain[j]+" occurs "+Len(stringIndexes)+" times.");

            for(var stringIndex=0; stringIndex<stringIndexes.length; stringIndex++) {
              tempResults = tempResults + [currentString];
              tempAtWhichPositions += [stringIndexes[stringIndex]];
            }
          }
        }
      } else {
        //pattern chains
        console.log("found pattern chain");
      }
    }

    return result;
  };

  /**
   * @description Returns a substring of self.
   * @param {object} [flags] start; end; length
   * @return {string} The substring
   */
  this.subString = function(flags) {
    if(!flags) {
      flags = {start: 0}
    }

    if('length' in flags) {
      return this.getValue().substr(flags.start, flags.length);
    } else if('end' in flags) {
      return this.getValue().substring(flags.start, flags.end);
    } else {
      return this.getValue().substr(flags.start);
    }
  };

  /**
   * @description Exchanges the occurrence(s) of a search string by a replacement string
   * @param {string} search The string that should be replaced
   * @param {string} replacement the string that will replace @search
   * @param {string} flags [self] -> apply to this object; [new] -> return exchanged string to new String object
   * @return {string} null if applied to self; otherwise the exchanged string
   */
  this.exchange = function(search, replacement, flags) {
    return '';
  };

  /**
   * @description Returns the ASCII code of the string character at a given position
   * @param {int} pos The position of the wanted character
   * @return {int} the ASCII code of the string character at @pos
   */
  this.asciiAt = function(pos) {
    return this.value.charCodeAt(pos);
  };

  /**
   * @description Returns the string character at a given position
   * @param {int} pos The position of the wanted character
   * @return {string} the character at @pos
   */
  this.charAt = function(pos) {
    return String.fromCharCode(this.asciiAt(pos));
  };

  /**
   * @description Splits self into a new String array divided by a delimiter string
   * @param {string} delimiter A delimiter string by which this object is split
   * @return {string[]} Null if delimiter not found, otherwise an array with separated strings
   */
  this.split = function(delimiter) {
    return this.getValue().split(delimiter);
  };

  /**
   * @description Counts how often a search string occurs
   * @param {string} search The search string
   * @param {object} [flags] TODO is this needed?
   * @return {int} 0 if not found, otherwise the number of occurrences
   */
  this.countOccurrences = function(search, flags) {
    return (this.getValue().match(new RegExp(search, 'g')) || []).length;
  };

  /**
   * @description Reverses the order of all string characters
   * @flags {object} [flags] 'self' -> apply to this object; 'new' -> return reverse string to new String object
   * @return {string} null if applied to self; otherwise the reverse string
   */
  this.reverse = function(flags) {
    return this.getValue().split("").reverse().join("");
  };
};


/**
 * @description Patterns like RegEx's
 * @param {string[]} chain A TList object which saves the elements of which the Pattern consists
 * @param {int} minOccurrence
 * @param {int} maxOccurrence
 */
var S_Pattern = function() {
  //@TODO
  this.chain = [];
  this.minOccurrence = 0;
  this.maxOccurrence = 0;

  /**
   * @description Adds a string to the chain.
   * @param {string} s A string
   */
  this.add = function(s) {
    Self.chain.push(s);
  };

  /**
   * @description Adds many strings to the chain.
   * @param {string[]} s A string array
   */
  this.addMany = function(s) {
    for(var i=0; i<s.length; i++) {
      this.chain.push(s[i]);
    }
  };

  /**
   * @description
   * @param {int} atLeast
   * @param {int} atMost
   */
  this.occurs = function(atLeast, atMost) {
    this.minOccurrence = atLeast;
    this.maxOccurrence = atMost;
  };

  /**
   * @description
   * @param {int} value
   */
  this.occursExactly = function(value) {
    this.minOccurrence = value;
    this.maxOccurrence = value;
  };


  /**
  OLD STUFF BELOW
  */

  /**
   * @description An arbitrary subset of @set occurs certain times
   * @param {string[]} set An S_StringSet object
   * @param {int} howOftenMin how often the subset occurs at least
   * @param {int} howOftenMax how often the subset occurs at most
   */
  this.occursAny = function(set, howOftenMin, howOftenMax) {
    //@TODO
    this.addOccurrence(set, -1, howOftenMin, howOftenMax, "any");
  };

  /**
   * @description A subset of @set with at least @howMany strings occurs certain times
   * @param {string[]} set An S_StringSet object
   * @param {int} howMany how many strings the subset of @set must have at least
   * @param {int} howOftenMin how often the subset occurs at least
   * @param {int} howOftenMax how often the subset occurs at most
   */
  this.occursAtLeast = function(set, howMany, howOftenMin, howOftenMax) {
    //@TODO
    this.addOccurrence(set, howMany, howOftenMin, howOftenMax, "at_least");
  };

  /**
   * @description A subset of @set with at most @howMany strings occurs certain times
   * @param {string[]} set An S_StringSet object
   * @param {int} howMany how many strings the subset of @set can have at most
   * @param {int} howOftenMin how often the subset occurs at least
   * @param {int} howOftenMax how often the subset occurs at most
   */
  this.occursAtMost = function(set, howMany, howOftenMin, howOftenMax) {
    //@TODO
    this.addOccurrence(set, howMany, howOftenMin, howOftenMax, "at_most");
  };

  /**
   * @description All strings of @set occur certain times
   * @param {string[]} set An S_StringSet object
   * @param {int} howOftenMin how often the set occurs at least
   * @param {int} howOftenMax how often the set occurs at most
   */
  this.occursEvery = function(set, howOftenMin, howOftenMax) {
    //@TODO
    this.addOccurrence(set, -1, howOftenMin, howOftenMax, "every")
  };

  /**
   * @description A "parent pattern" occurs several times
   * @param {S_Pattern} pattern A "parent" S_Pattern object
   * @param {int} howOftenMin how often @pattern occurs at least
   * @param {int} howOftenMax how often @pattern occurs at most
   */

  this.occursPattern = function(pattern, howOftenMin, howOftenMax) {
    //@TODO
  };

  /**
   * @description
   * @param {string[]} set An S_StringSet object
   * @param {int} howMany how many strings the subset of @set can have at most
   * @param {int} howOftenMin how often the subset occurs at least
   * @param {int} howOftenMax how often the subset occurs at most
   * @param {string} sort
   */
  this.addOccurrence = function(set, howMany, howOftenMin, howOftenMax, sort) {
    /**
     Local o:S_Occurrence = New S_Occurrence
     o.set = set
     o.howMany = howMany
     o.howOftenMin = howOftenMin
     o.howOftenMax = howOftenMax
     o.sort = sort
     chain.AddLast(o)
     */
  };

  /**
   * @description
   * @param {S_String} search
   */
  this.find = function(search) {
    /**
    For o:S_Occurrence = EachIn chain
    For s:String = EachIn o.set
    Local totalOccurrences:Int[] = search.AllIndexesOf(s)
    If(Len(totalOccurrences) >= o.howOftenMin And Len(totalOccurrences) <= o.howOftenMax) Then
    'add sub-result
    EndIf
    Next
    Next
    */
  };
};

/**
 * @description Chains several patterns or other pattern chains together
 * @param {object[]} chain
 * @param {string[} chainTypes
 */
var S_PatternChain = function() {
  this.chain = [];
  this.chainTypes = [];

  /**
   * @description Adds a pattern and its type ('pattern') to the chain
   * @param {S_Pattern} pattern A pattern
   */
  this.addPattern = function (pattern) {
    this.chain.push(pattern);
    this.chainTypes.push('pattern');
  };

  /**
   * @description Adds a pattern chain and its type ('patternChain') to the chain
   * @param {S_PatternChain} patternChain A pattern chain
   */
  this.addPatternChain = function (patternChain) {
    this.chain.push(patternChain);
    this.chainTypes.push('patternChain');
  };

  /**
   * @description
   * @param {string} open
   * @param {string} close
   * @param {string} flags
   */
  this.surround = function (open, close, flags) {
    var openPattern = new S_Pattern();
    openPattern.add(open);
    this.chain = [openPattern] + chain;
    var closePattern = new S_Pattern();
    closePattern.add(close);
    this.addPattern(closePattern);
  };

  /**
   * @description
   * @param {string[]} open
   * @param {string[]} close
   * @param {string} flags
   */
  this.surroundChoice = function (open, close, flags) {
    var openPattern = new S_Pattern();
    openPattern.addMany(open);
    this.chain = [openPattern] + this.chain;
    this.chainTypes.push('pattern');
    var closePattern = new S_Pattern();
    closePattern.addMany(close);
    this.addPattern(closePattern);
    this.chainTypes.push('pattern');
  };
};

/**
 * @description Data type for Occurrences of S_StringSet's
 * @param {string[]} set
 * @param {int} howMany
 * @param {int} howOftenMin
 * @param {int} howOftenMax
 * @param {string} sort
 */
var S_Occurrence = function() {
  this.set = [];
  this.howMany = 0;
  this.howOftenMin = 0;
  this.howOftenMax = 0;
  this.sort = '';
};

/**
 * @description Data type for results after @Search-Method was executed on an S_String object
 * @param {string[]} results What is (are) the result string(s)
 * @param {int} howOften How often the pattern was found
 * @param {int[]} atWhichPositions At which position(s) in the string
 */
var S_Trove = function() {
  this.results = [];
  this.howOften = 0;
  this.atWhichPositions = [];
};
