/**
 * Created by stbe on 21.03.16.
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
   * @param {string} flags [first; last; inner=%; innerLast=%; occursMin=%; occursMax=%; occursExactly=%; ignoreCase]
   * @return {number} the specified index of @search
   */
  this.indexOf = function(search, flags) {
    if(!flags) { flags="first;"; }
    var selfCharPos = 0;		//current position inside self
    var searchCharPos = 0;		//current position inside the search string
    var indexFound = -1;		//the position where the wanted index was found, or -1
    var minIndexes = -1;		//how many indexes need to occur at least
    var maxIndexes = 10000;	//how many indexes need to occur at most
    var totalIndexes = 0;		//how many indexes have been found
    var targetIndex;			//the how maniest index should be returned
    var selfFormatted = this.value;
    var searchFormatted = search;

    //parse flags
    var flagParser = new S_FlagParser();
    flagParser.getFlags(flags);
    for(var i=0; i<flagParser.key.length; i++) {
      switch(flagParser.key[i]) {
        case "first":
          targetIndex = 1; break;
        case "last":
          targetIndex = -1; break;
        case "inner":
          //Print "inner flag matched with value "+flagParser.value[i]
          targetIndex = parseInt(flagParser.value[i]);
          break;
        case "innerLast":
          targetIndex = 0 - parseInt(flagParser.value[i]); break;
        case "occursMin":
          minIndexes = parseInt(flagParser.value[i]); break;
        case "occursMax":
          maxIndexes = parseInt(flagParser.value[i]); break;
        case "occursExactly":
          minIndexes = parseInt(flagParser.value[i]);
          maxIndexes = parseInt(flagParser.value[i]);
          break;
        case "ignoreCase":
          selfFormatted = selfFormatted.toLowerCase();
          searchFormatted = searchFormatted.toLowerCase();
          break;
      }
    }

    while(selfCharPos < selfFormatted.length) {
      //Print "selfCharPos: "+selfCharPos
      //Print "searchCharPos: "+searchCharPos

      if(selfFormatted[selfCharPos] == searchFormatted[searchCharPos]) {
        if(indexFound = -1) { indexFound = selfCharPos; }
        searchCharPos++;
      } else {
        searchCharPos = 0;
        indexFound = -1;
      }

      selfCharPos++;

      if(searchCharPos == search.length) {
        totalIndexes = totalIndexes + 1;
        if(((targetIndex == totalIndexes) || targetIndex < 0) && (totalIndexes >= minIndexes) && (totalIndexes <= maxIndexes)) { break; }
        searchCharPos = 0;
      }
    }

    if(targetIndex != totalIndexes) { indexFound = -1; }
    return indexFound;
  };

  /**
   * @description Returns all indexes of a given search string
   * @param {string} search The string whose index is needed
   * @param {string} flags [occursMin=%; occursMax=%, occursExactly=%, ignoreCase]
   * @return {number[]} all indexes of @search
   */
  this.allIndexesOf = function(search, flags) {
    if(!flags) { flags = ''; }
    var result = [];
    var lookIndex = 1;
    while(true) {
      //Print "hanging in AllIndexesOf with inner="+lookIndex
      //TODO: pass the remaining flags too
      var currentResult = this.indexOf(search, "inner="+lookIndex+";");
      if(currentResult > -1) {
        result.push(currentResult);
        lookIndex++;
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
    if(!flags) { flags = 'first;'; }
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
    if(!flags) { flags = ''; }

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
   * @description Returns a substring of self with left and right borders.
   * @param {number} startPos The left border (where the result starts)
   * @param {number} endPos The right border (where the result ends)
   * @param {string} flags [endAsLength] -> return substring from startPos to (startPos+end)
   * @return {string} TODO
   */
  this.subString = function(startPos, endPos, flags) {
    if(!flags) { flags = 'endAsPos'; }
    var result = '';
    var endPosReal = endPos;
    if(flags == 'endAsLength') { endPosReal += startPos; }
    for(var i = startPos; i<=endPosReal; i++) {
      result += String.fromCharCode(this.value[i]);
    }

    return result;
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
    return this.Value[pos];
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
    var delimiterIndexes = this.allIndexesOf(delimiter);
    if(delimiterIndexes.length == 0) { return null; }

    var result = [];
    //if delimiter occurs at last position of this element, there is no part-string behind it
    //TODO change this code for JavaScript??
    if(delimiterIndexes[delimiterIndexes.length-1] == this.value.length-1) {
      result = new String[delimiterIndexes.length]
    } else {
      result = new String[delimiterIndexes.length+1]
    }

    var startPos = 0;
    for(var i=0; i<delimiterIndexes.length; i++) {
      result[i] = this.subString(startPos, delimiterIndexes[i]-1);
      startPos = delimiterIndexes[i] + 1;
    }
    if(startPos < this.value.length) {
      result[delimiterIndexes.length] = this.subString(startPos, Self.value.length-1);
    }

    return result;
  };

  /**
   * @description Counts how often a search string occurs
   * @search {string} The search string
   * @flags {string} TODO
   * @return {int} 0 if not found, otherwise the number of occurrences
   */
  this.countOccurrences = function(search, flags) {
    if(!flags) { flags = ''; }
    var result = 0;
    var pos = 1;
    var i = -1;
    while(true) {
      i = this.indexOf(search, "inner="+pos+";");
      if(i == -1) { break; }
      pos = pos + 1;
      result = result + 1
    }
    return result;
  };

  /**
   * @description Reverses the order of all string characters
   * @flags {string} [self] -> apply to this object; [new] -> return reverse string to new String object
   * @return {string} null if applied to self; otherwise the reverse string
   */
  this.reverse = function(flags) {
    if(!flags) { flags = 'self'; }
    var result = '';
    for(var i=this.value.length-1; i>=0; i--) {
      result += this.charAt(i);
    }

    if(flags == 'self') {
      return null;
    } else {
      return result;
    }
  };

};

/*'@description Creates a new S_String object
 '@value The string value for the new S_String object
 '@return The new S_String object with @value
 Function CreateSparkString:S_String(value:String)
 Local s:S_String = New S_String
 s.value = value
 Return s
 End Function

 '@description Data type for Flag Parsing (used mainly in S_String object methods)
 '@key A string array which saves all keys (=flag names)
 '@value A string array which saves all flag values (if they exist)
 Type S_FlagParser
 Field key:String[] = New String[0]
 Field value:String[] = New String[0]

 '@description Parses all flags from a given string and stores them in the object's @key / @value field
 '@flags An string that contains flags
 '@annotation This method uses "classical" string functions instead of S_String methods to avoid infinite loops
 Method GetFlags(flags:String)
 'get all delimiter positions
 Local delimiterPos:Int[] = New Int[0]
 Local currentDelimiterPos:Int = 0
 Repeat
 currentDelimiterPos = Instr(flags,";", currentDelimiterPos+1)
 If(currentDelimiterPos = 0) Then Exit
 delimiterPos = delimiterPos[..Len(delimiterPos)+1]
 delimiterPos[Len(delimiterPos)-1] = currentDelimiterPos
 Forever

 For Local i:Int=0 To Len(delimiterPos)-1
 Local startPos:Int
 If(i = 0) Then
 startPos = 1
 Else
 startPos = delimiterPos[i-1]+1
 EndIf
 Local flag:String = Trim(Mid(flags, startPos, delimiterPos[i]-startPos))

 Self.key = Self.key[..Len(Self.key)+1]
 Self.value = Self.value[..Len(Self.value)+1]
 Local equalsPos:Int = Instr(flag, "=")
 If(equalsPos > 0) Then
 Self.key[Len(Self.key)-1] = Mid(flag, 1, equalsPos-1)
 Self.value[Len(Self.value)-1] = Mid(flag, equalsPos+1)
 Else
 Self.key[Len(Self.key)-1] = flag
 Self.value[Len(Self.value)-1] = ""
 EndIf
 Next
 End Method
 End Type

 '@description Patterns like RegEx's
 '@chain A TList object which saves the elements of which the Pattern consists
 '@TODO
 Type S_Pattern
 Field chain:String[]
 Field minOccurrence:Int
 Field maxOccurrence:Int

 Method Add(s:String)
 Self.chain = Self.chain[..Len(Self.chain)+1]
 Self.chain[Len(Self.chain)-1] = s
 End Method

 Method AddMany(s:String[])
 For Local i:Int=0 To Len(s)-1
 Self.chain = Self.chain[..Len(Self.chain)+1]
 Self.chain[Len(Self.chain)-1] = s[i]
 Next
 End Method

 Method Occurs(atLeast:Int, atMost:Int)
 Self.minOccurrence = atLeast
 Self.maxOccurrence = atMost
 End Method

 Method OccursExactly(value:Int)
 Self.minOccurrence = value
 Self.maxOccurrence = value
 End Method


 Rem
 OLD STUFF BELOW
 End Rem

 '@description An arbitrary subset of @set occurs certain times
 '@set An S_StringSet object
 '@howOftenMin how often the subset occurs at least
 '@howOftenMax how often the subset occurs at most
 '@TODO
 Method OccursAny:Int(set:String[], howOftenMin:Int, howOftenMax:Int)
 AddOccurrence(set, -1, howOftenMin, howOftenMax, "any")
 End Method

 '@description A subset of @set with at least @howMany strings occurs certain times
 '@set An S_StringSet object
 '@howMany how many strings the subset of @set must have at least
 '@howOftenMin how often the subset occurs at least
 '@howOftenMax how often the subset occurs at most
 '@TODO
 Method OccursAtLeast(set:String[], howMany:Int, howOftenMin:Int, howOftenMax:Int)
 AddOccurrence(set, howMany, howOftenMin, howOftenMax, "at_least")
 End Method

 '@description A subset of @set with at most @howMany strings occurs certain times
 '@set An S_StringSet object
 '@howMany how many strings the subset of @set can have at most
 '@howOftenMin how often the subset occurs at least
 '@howOftenMax how often the subset occurs at most
 '@TODO
 Method OccursAtMost(set:String[], howMany:Int, howOftenMin:Int, howOftenMax:Int)
 AddOccurrence(set, howMany, howOftenMin, howOftenMax, "at_most")
 End Method

 '@description All strings of @set occur certain times
 '@set An S_StringSet object
 '@howOftenMin how often the set occurs at least
 '@howOftenMax how often the set occurs at most
 '@TODO
 Method OccursEvery(set:String[], howOftenMin:Int, howOftenMax:Int)
 AddOccurrence(set, -1, howOftenMin, howOftenMax, "every")
 End Method

 '@description A "parent pattern" occurs several times
 '@pattern A "parent" S_Pattern object
 '@howOftenMin how often @pattern occurs at least
 '@howOftenMax how often @pattern occurs at most
 '@TODO
 Method OccursPattern(pattern:S_Pattern, howOftenMin:Int, howOftenMax:Int)

 End Method

 Method AddOccurrence(set:String[], howMany:Int, howOftenMin:Int, howOftenMax:Int, sort:String)
 Rem
 Local o:S_Occurrence = New S_Occurrence
 o.set = set
 o.howMany = howMany
 o.howOftenMin = howOftenMin
 o.howOftenMax = howOftenMax
 o.sort = sort
 chain.AddLast(o)
 End Rem
 End Method

 Method Find(search:S_String)
 Rem
 For o:S_Occurrence = EachIn chain
 For s:String = EachIn o.set
 Local totalOccurrences:Int[] = search.AllIndexesOf(s)
 If(Len(totalOccurrences) >= o.howOftenMin And Len(totalOccurrences) <= o.howOftenMax) Then
 'add sub-result
 EndIf
 Next
 Next
 End Rem
 End Method
 End Type

 '@description Chains several patterns or other pattern chains together
 Type S_PatternChain
 Field chain:Object[]
 Field chainTypes:String[]

 Method AddPattern(pattern:S_Pattern)
 Self.chain = Self.chain[..Len(Self.chain)+1]
 Self.chain[Len(Self.chain)-1] = pattern
 Self.chainTypes = Self.chainTypes + [""]
 Self.chainTypes[Len(Self.chainTypes)-1] = "pattern"
 End Method

 Method AddPatternChain(patternChain:S_PatternChain)
 Self.chain = Self.chain[..Len(Self.chain)+1]
 Self.chain[Len(Self.chain)-1] = patternChain
 Self.chainTypes = Self.chainTypes + [""]
 Self.chainTypes[Len(Self.chainTypes)-1] = "patternChain"
 End Method


 Method Surround(open:String, close:String, flags:String)
 Local openPattern:S_Pattern = New S_Pattern
 openPattern.Add(open)
 chain = [openPattern] + chain
 Local closePattern:S_Pattern = New S_Pattern
 closePattern.Add(close)
 Self.AddPattern(closePattern)
 End Method

 Method SurroundChoice(open:String[], close:String[], flags:String)
 Local openPattern:S_Pattern = New S_Pattern
 openPattern.AddMany(open)
 Self.chain = [openPattern] + Self.chain
 Self.chainTypes = Self.chainTypes + ["pattern"]
 Local closePattern:S_Pattern = New S_Pattern
 closePattern.AddMany(close)
 Self.AddPattern(closePattern)
 Self.chainTypes = Self.chainTypes + ["pattern"]
 End Method
 End Type

 '@description Data type for Occurrences of S_StringSet's
 Type S_Occurrence
 Field set:String[]
 Field howMany:Int
 Field howOftenMin:Int
 Field howOftenMax:Int
 Field sort:String
 End Type

 '@description Data type for String collections that can be used for S_Pattern objects.
 '@TODO remove this code??
 Rem
 Type S_StringSet
 Field chain:String[]
 '@description Adds a new String to Self
 '@newString a new String for this set
 Method Add(newString:String)
 Self.chain = Self.chain[..Len(Self.chain)+1]
 Self.chain[Len(Self.chain)-1] = newString
 End Method

 '@description Adds some new Strings to Self
 '@newString some new Strings for this set
 Method AddMany(newStrings:String[])
 For Local currentString:String = EachIn newStrings
 Self.Add(currentString)
 Next
 End Method
 End Type
 End Rem

 '@description Data type for results after @Search-Method was executed on an S_String object
 '@TODO
 Type S_Trove
 Field results:String[]			'what is (are) the result string(s)
 Field howOften:Int				'how often the pattern was found
 Field atWhichPositions:Int[]	'at which position(s) in the string
 End Type*/