import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { X } from 'lucide-react-native';

type InfoModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
};

const InfoModal = ({ visible, onClose, title, content }: InfoModalProps) => {
  const { theme } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[
          styles.modalView,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border
          }
        ]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={[styles.contentText, { color: theme.colors.text }]}>
              {content}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalView: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 24,
  },
});

export default InfoModal;