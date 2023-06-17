import React, {useState} from 'react';
import {Text, View, TextInput, Keyboard, TouchableOpacity} from 'react-native';
import DupeButton from './DupeButtton';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from '../styles/wallet';
import {theme} from '../styles/theme';

export const DisplayBox = ({
  title,
  value,
  isFocused,
  setFocused,
  type = '',
}) => {
  const [seed, setSeed] = useState({secureSeed: true});
  const [rules, setRules] = useState({seedPhraseRules: true});

  console.log({value, seed});

  const toggleSecureSeedPhrase = () => {
    setSeed({
      ...seed,
      secureSeed: !seed?.secureSeed,
    });
  };

  const toggleSeedPhraseRules = () => {
    setRules({
      ...rules,
      seedPhraseRules: !rules.seedPhraseRules,
    });
  };
  const handleOnFocus = () => setFocused(title);

  return (
    <TouchableOpacity
      //   onPressIn={handleOnFocus}
      style={[styles.readOnlyBox, isFocused ? styles.readOnlyBoxShadow : {}]}>
      <View>
        <View style={styles.titleCopyButton}>
          <Text style={styles.textBoxTitle}>{title}</Text>
          <DupeButton text={value} onCopied={item => item} />
        </View>
        <TextInput
          numberOfLines={2}
          style={styles.textBoxValue}
          value={value}
          maxLength={42}
          onFocus={() => Keyboard.dismiss()}
          secureTextEntry={seed?.secureSeed ? true : false}
        />
      </View>
      <View style={styles.secureFeather}>
        <TouchableOpacity onPress={toggleSecureSeedPhrase}>
          {seed?.secureSeed ? (
            <Feather name="eye" color={theme.COLORS.WHITE} size={15} />
          ) : (
            <Feather name="eye-off" color={theme.COLORS.WHITE} size={15} />
          )}
        </TouchableOpacity>
      </View>
      {type === 'mnemonics' ? (
        <View>
          <Text numberOfLines={4} style={styles.textBoxPhraseValue}>
            <Text style={{color: 'yellow'}}>NEVER SHARE YOUR SEED! </Text>
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
