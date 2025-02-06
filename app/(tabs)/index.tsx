import { Image, StyleSheet, Platform, FlatList, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React, { useEffect } from 'react';
import { AxiosError } from 'axios';
import { postService } from '@/api/posts/posts.service';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { Spinner } from '@/components/ui/spinner';
import colors from "tailwindcss/colors";
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { AddIcon, ArrowLeftIcon, CheckCircleIcon, ChevronRightIcon, ClockIcon, CloseCircleIcon, CopyIcon, DownloadIcon, EditIcon, EyeOffIcon, Icon, LinkIcon, ThreeDotsIcon, TrashIcon } from '@/components/ui/icon';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetIcon, ActionsheetItem, ActionsheetItemText } from '@/components/ui/actionsheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fab, FabIcon, FabLabel } from '@/components/ui/fab';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

export default function HomeScreen() {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = React.useState<Array<any>>([]);
  const [dataSourceStorage, setDataSourceStorage] = React.useState<Array<any>>([]);
  const [activeId, setActiveId] = React.useState<any>(null);
  const [error, setError] = React.useState<any>(null);
  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false)
  const handleClose = () => setShowActionsheet(false);
  const [textTitle, onChangeTextTitle] = React.useState('');
  const [textBody, onChangeTextBody] = React.useState('');

  useEffect(() => {
    getAllItems();
  }, [])

  useEffect(() => {
    saveValue(dataSource);
  }, [dataSource]);

  const handleToast = (title: string, description: string) => {
    if (!toast.isActive(toastId)) {
      showNewToast(title, description)
    }
  }

  const showNewToast = (title: string, description: string) => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }: any) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>
              {description}
            </ToastDescription>
          </Toast>
        )
      },
    })
  }

  const loadData = () => {
    setIsLoading(true);
    postService.list().then((response) => {
      let responseData = getItemsMap(response.data);
      setDataSource(getItemsMap(responseData));
      console.log('teste gb', dataSource)
      //saveValue();
    }).catch((error: AxiosError) => {
      handleToast('Erro', (error.response?.data as AxiosError).message);
      setError(error.response);
    }).then(() => {
      setIsLoading(false);
    })
  }

  const getItemsMap = (items:any) => {
    return items.map((obj:any) => ({ ...obj, completed: false }));
  }

  const getAllItems = async () => {
    let items:any[] = [];

    try {
      let data:any = await AsyncStorage.getItem('@save_posts');
      console.log(data)
      items = data != null ? JSON.parse(data)?.items : [];
      if(items.length > 0)
      {
        setDataSource(items);
      }
      else
      {
        loadData();
      }
    } catch (e) {
      // read key error
    }
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  }

  const saveValue = async (item:any) => {
    let itemSave:any = await AsyncStorage.getItem('@save_posts');
    let data = {
      save:true,
      items: item
    }

    console.log('sim salvou', itemSave)

    try {
      if(itemSave)
      {
        await AsyncStorage.mergeItem('@save_posts', JSON.stringify(data));
      }
      else{
        await AsyncStorage.setItem('@save_posts', JSON.stringify(data));
      }
    } catch (e) {
      // save error
    }

    console.log('Done.')
  }

  const toggleCompleted = (value: any) => {
    setDataSource(dataSource.map(task => (task.id === value ? { ...task, completed: !task.completed } : task)));
    let textMessage = itemById(value)?.completed ? 'Tarefa Desmarcada com sucesso' : 'Tarefa Marcada como Concluída com sucesso';
    handleToast('Aviso', textMessage);
    handleClose();
  }

  const openActionsheet = (value: number) => {
    setActiveId(value);
    setShowActionsheet(true);
  }

  const addTask = () => {
    const newTask = { userId:1, id: Date.now(), title:textTitle, body: textBody, completed: false };
    setDataSource([...dataSource, newTask]);
    onChangeTextTitle('');
    onChangeTextBody('');
    setShowModal(false);
    handleToast('Aviso', 'Item Adicionado com Sucesso');
  }

  const deleteTask = () => {
    setDataSource(dataSource.filter(task => task.id !== activeId));
    handleClose();
    handleToast('Aviso', 'Item Excluído com Sucesso');
  }

  const itemById = (id:any) => {
    return dataSource?.find(task => task.id == id);
  }

  const submitForm = () => {
    addTask();
  }

  const renderRow = ({ item }: any) => {
    return (
      <Card size="md" variant="elevated" className="m-3">
        <HStack className="justify-between items-center">
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <Icon as={LinkIcon} size="lg" className="stroke-white" />
            </Avatar>
            <VStack>
              <Heading size="sm">Tarefa - {item?.id}</Heading>
              <Text>{item?.completed ? 'Concluído' : 'Não concluído'}</Text>
            </VStack>
          </HStack>
          <HStack space="md">
            <Button size="lg" className="rounded-full p-3.5" onPress={() => openActionsheet(item?.id)}>
              <ButtonIcon as={ThreeDotsIcon} />
            </Button>
          </HStack>
        </HStack>
      </Card>);
  };

  function NoItemsFound() {
    return (<Text>Nenhum registro encontrado</Text>);
  }

  const RenderFlatlist = () => {
    return (
      <FlatList
        data={dataSource}
        renderItem={renderRow}
        ListEmptyComponent={NoItemsFound}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  const ListData = () => {
    if (isLoading) {
      return (<Center><Spinner size="large" color={colors.gray[500]} /></Center>);
    }
    else {
      return (<RenderFlatlist />);
    }
  }




  return (
    <VStack style={{ flex: 1, marginTop: Constants.statusBarHeight }} className="flex-1 bg-secondary-100 md:bg-secondary-0 md:items-center md:justify-center ">
      <Card size="md" variant="elevated" className="m-3 mt-4">
        <Heading size="md" className="mb-1">
        Minhas Tarefas
        </Heading>
      </Card>
      <ListData />
      <Fab
        size="md"
        placement="bottom center"
        onPress={() => setShowModal(true)}
        isHovered={false}
        isDisabled={false}
        isPressed={false}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Adicionar Item</FabLabel>
      </Fab>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="flex-col items-start gap-0.5">
            <Heading>Adicionar Tarefa</Heading>
            <Text size="sm">Não se preocupe, nenhuma informação será guardada</Text>
          </ModalHeader>
          <ModalBody className="mb-4" contentContainerClassName="gap-3">
            <Input>
              <InputField placeholder="Digite um Título" onChangeText={onChangeTextTitle}
                value={textTitle} />
            </Input>
            <Textarea
      size="md"
      isReadOnly={false}
      isInvalid={false}
      isDisabled={false}
    >
      <TextareaInput placeholder="Seu texto vai aqui..." />
    </Textarea>
          </ModalBody>
          <ModalFooter className="flex-col items-start">
            <Button
              onPress={() => {
                submitForm();
              }}
              className="w-full"
            >
              <ButtonText>Adicionar</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showModal2}
        onClose={() => {
          setShowModal2(false)
        }}
      >
        <ModalBackdrop />
        <ModalContent className="max-w-[305px] items-center">
          <ModalHeader>
            <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center">
              <Icon as={TrashIcon} className="stroke-error-600" size="xl" />
            </Box>
          </ModalHeader>
          <ModalBody className="mt-0 mb-4">
            <Heading size="md" className="text-typography-950 mb-2 text-center">
            Excluir item
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
            Tem certeza de que deseja excluir esse item? Esta ação não pode ser
              desfeito.
            </Text>
          </ModalBody>
          <ModalFooter className="w-full">
            <Button
              variant="outline"
              action="secondary"
              size="sm"
              onPress={() => {
                setShowModal2(false)
              }}
              className="flex-grow"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              onPress={() => {
                deleteTask();
                setShowModal2(false);
              }}
              size="sm"
              className="flex-grow"
            >
              <ButtonText>Excluir</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={() => toggleCompleted(activeId)}>
            <ActionsheetIcon
              className="stroke-background-700"
              as={itemById(activeId)?.completed ? CloseCircleIcon : CheckCircleIcon}
            />
            <ActionsheetItemText>{itemById(activeId)?.completed ? 'Desmarcar Tarefa' : 'Marcar como concluído'}</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => setShowModal2(true)}>
            <ActionsheetIcon className="stroke-background-700" as={TrashIcon} />
            <ActionsheetItemText>Excluir</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem isDisabled onPress={handleClose}>
            <ActionsheetIcon className="stroke-background-700" as={ClockIcon} />
            <ActionsheetItemText>Lembre-me</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
