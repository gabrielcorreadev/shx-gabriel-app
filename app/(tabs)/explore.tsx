import { StyleSheet, Image, Platform, ScrollView, Pressable } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';
import { Blinds, ChevronRight, HeadsetIcon, MessageCircleQuestionIcon, Settings, Tablets, User } from 'lucide-react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link, LinkText } from '@/components/ui/link';
import { Divider } from '@/components/ui/divider';
import Constants from 'expo-constants';

export default function TabTwoScreen() {

  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
  React.useState(false);
  
  return (
    <ScrollView style={{ display: "flex" }}>
    <VStack style={{ flex: 1, marginTop: Constants.statusBarHeight }} className="px-5 py-4 flex-1 bg-white" space="lg">
      <Heading className="mb-1">Perfil</Heading>
      <ProfileCard />
      <Divider className="my-2" />
      <PersonalInfoSection />
      <Divider className="my-2" />
      <HostingSection />
      <Divider className="my-2" />
      <SupportSection />
      <Divider className="my-2" />
      <LogoutButton
        openLogoutAlertDialog={openLogoutAlertDialog}
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
      />
    </VStack>
  </ScrollView>
  );
}

const ProfileCard = () => {
  return (
    <HStack className="justify-between items-center bg-white">
      <HStack space="md">
        <Avatar className="bg-primary-500">
          <AvatarFallbackText>Gabriel Correa</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
            }}
          />
        </Avatar>
        <VStack>
          <Text>Gabriel Correa</Text>
          <Link>
            <LinkText
              size="sm"
              className="text-typography-500 no-underline hover:text-typography-500 active:text-typography-500"
            >
              Mostrar perfil
            </LinkText>
          </Link>
        </VStack>
      </HStack>
      <Pressable>
        <Icon as={ChevronRight} />
      </Pressable>
    </HStack>
  );
};

const PersonalInfoSection = () => {
  return (
    <VStack space="lg">
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={User} />
          <Text>Informações pessoais</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Settings} />
          <Text>Conta</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const HostingSection = () => {
  return (
    <VStack space="lg">
      <Heading className="mb-1">Tarefas</Heading>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Blinds} />
          <Text>Minhas Tarefas</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={Tablets} />
          <Text>Bloqueadas</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const SupportSection = () => {
  return (
    <VStack space="lg">
      <Heading className="mb-1">Suporte</Heading>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={MessageCircleQuestionIcon} />
          <Text>Obtenha ajuda</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <HStack className="justify-between">
        <HStack space="md">
          <Icon as={HeadsetIcon} />
          <Text>Contate o suporte</Text>
        </HStack>
        <Pressable>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
    </VStack>
  );
};

const LogoutButton = ({ setOpenLogoutAlertDialog }: any) => {
  return (
    <Button
      action="secondary"
      variant="outline"
      onPress={() => {
      }}
    >
      <ButtonText>Sair</ButtonText>
    </Button>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
