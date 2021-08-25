import { PageContainer } from 'components/Container';
import { useForm } from 'react-hook-form';
import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';
import React, { useState } from 'react';
import { Image, Stack } from '@metafam/ds';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useWeb3 } from '../../../lib/hooks';
import { useCallback } from 'react';
import { useRef } from 'react';

const InfoPage = () => {
  const [did, setDid] = useState<string>();
  const image = useRef<any>();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue
  } = useForm();
  const { ceramic, idx, address, storageClient } = useWeb3();
  console.log(did);

  const handleFileUpload = useCallback((event: any) => {
    console.log(event.target.files)
    // const blobFile = new Blob(event.target.files);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      console.log(reader.result);
      if (image && image.current){
        image.current.onload = async () => {
          console.log(image.current.width, image.current);
          const cid = await storageClient?.put(event.target.files);
          console.log({ cid });
        }
        image.current.src = reader.result;
      }
    })
    reader.readAsDataURL(event.target.files[0]);
  }, [])

  useEffect(() => {
    // fetch from IDX
    (async() => {
      if (ceramic && address) {
        const caip10 = await Caip10Link.fromAccount(ceramic, `${address}@eip155:1`)
        if(caip10.did){
          setDid(caip10.did);
          const result = await idx?.get('basicProfile', caip10.did);
          Object.entries(result as Record<string, any>).forEach(
            ([key, value]) => {
              if (['image', 'background'].includes(key)){
                value = (value as Record<string, any>).original.src;
              }
              if(key === "birthDate"){
                value = new Date(value as string)
              }
              setValue(key, value)
            })
        }
      }
    })()

  }, [ceramic, address])

  function onSubmit(values: any) {
    console.log(values)
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve(values);
      }, 3000);
    });
  }
  return (
    <PageContainer>
      Hello Meta Profile
      <Image ref={image} visibility="hidden" />
      <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="name">First name</FormLabel>
          <Input
            name="name"
            placeholder="name"
            ref={register}
            {...register("name", {
              required: "This is required",
              minLength: { value: 2, message: "Minimum length should be 2" },
              maxLength: { value: 150, message: "Maximum length should be 150" },
            })}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.image}>
          <FormLabel htmlFor="image">First name</FormLabel>
          <Input
            name="image"
            placeholder="image"
            ref={register}
            {...register("image", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
              maxLength: { value: 150, message: "Maximum length should be 150" },
            })}
          />
          <FormErrorMessage>
            {errors.image && errors.image.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.background}>
          <FormLabel htmlFor="background">First name</FormLabel>
          <Input
            name="background"
            type="file"
            placeholder="background"
            ref={register}
            onChange={handleFileUpload}
            {...register("background", {
              required: "This is required",
              minLength: { value: 4, message: "Minimum length should be 4" },
              maxLength: { value: 150, message: "Maximum length should be 150" },
            })}
          />
          <FormErrorMessage>
            {errors.background && errors.background.message}
          </FormErrorMessage>
        </FormControl>
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
          Submit
        </Button>
      </Stack>
    </PageContainer>
  )
}


export default InfoPage;