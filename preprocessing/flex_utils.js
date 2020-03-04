/* functions for accessing data within FLEx's format (except parsed to JSON): */

function getDocumentFirstWord(doc) {
  const firstParagraph = getDocumentParagraphs(doc)[0];
  const firstSentence = getParagraphSentences(firstParagraph)[0];
  return getSentenceWords(firstSentence)[0];
}

function getDocumentParagraphs(doc) {
  let paragraphs = [];
  const wrappedParagraphs = doc.paragraphs[0].paragraph;
  for (const wrappedParagraph of wrappedParagraphs) {
    if (wrappedParagraph.phrases == null) continue; // if this paragraph is empty, skip it instead of erroring
    paragraphs.push(wrappedParagraph.phrases[0].word);
  }
  return paragraphs;
}

function getParagraphSentences(paragraph) {
  let sentences = [];
  for (const wrappedSentence of paragraph) {
    if (wrappedSentence.words == null) continue; // if this sentence is empty, skip it instead of erroring
    sentences.push(wrappedSentence); // breakdown within wrappedSentence.words[0].word; free glosses within wrappedSentence.item
  }
  return sentences;
}

function getSentenceFreeGlosses(sentence) {
  let freeGlosses = [];
  const rawFreeGlosses = sentence.item;
  for (const gloss of rawFreeGlosses) {
    if (gloss.$.type === "gls") {
      const glossValue = gloss._;
      if (glossValue != null) {
        freeGlosses.push(gloss);
      }
    } // else there's not actually a gloss here, just the metadata/placeholder for one
  } // else it might be type "segnum" (sentence number) or similar; we'll ignore it
  return freeGlosses;
}

function getSentenceStartTime(sentence) {
  const sentenceProperties = sentence.$;
  if (sentenceProperties != null) {
    const timeString = sentenceProperties['begin-time-offset'];
    if (timeString != null) {
      return parseInt(timeString, 10);
    }
  }
  return null;
}

function getSentenceEndTime(sentence) {
  const sentenceProperties = sentence.$;
  if (sentenceProperties != null) {
    const timeString = sentenceProperties['end-time-offset'];
    if (timeString != null) {
      return parseInt(timeString, 10);
    }
  }
  return null;
}

function getSentenceWords(sentence) {
  return sentence.words[0].word;
}

function getWordMorphs(word) {
  if (word.morphemes == null) {
    return [];
  }
  return word.morphemes[0].morph;
}

function getWordValue(word) {
  return word.item[0]._;
}

function getWordLang(word) {
  return word.item[0].$.lang;
}

function getMorphTiers(morph) {
  return morph.item;
}

function getMorphPartOfSpeech(morph) {
  if (morph.$ == null) { // TODO I have no idea why this happens sometimes but it does
    return null;
  }
  return morph.$.type;
}

function getMorphTierValue(morphTier) {
  return morphTier._;
}

function getFreeGlossValue(freeGloss) {
  return freeGloss._;
}

module.exports = {
  getDocumentFirstWord: getDocumentFirstWord,
  getDocumentParagraphs: getDocumentParagraphs,
  getParagraphSentences: getParagraphSentences,
  getSentenceFreeGlosses: getSentenceFreeGlosses,
  getSentenceStartTime: getSentenceStartTime,
  getSentenceEndTime: getSentenceEndTime,
  getSentenceWords: getSentenceWords,
  getWordMorphs: getWordMorphs,
  getWordValue: getWordValue,
  getWordLang: getWordLang,
  getMorphTiers: getMorphTiers,
  getMorphPartOfSpeech: getMorphPartOfSpeech,
  getMorphTierValue: getMorphTierValue,
  getFreeGlossValue: getFreeGlossValue,
};