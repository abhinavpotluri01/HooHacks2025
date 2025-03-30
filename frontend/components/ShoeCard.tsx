import { View, Text, Image } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';

const ShoeCard = ({id, image} : {id : any, image: any}) => {
  return (
    //@ts-ignore
    <Link href={`/shoe/${id}`} asChild className='mb-4'>
    <TouchableOpacity className='border border-black h-60 rounded-2xl bg-black-100 mb-4'>
        <Image source={{uri: image}} resizeMethod="cover" className='h-full w-full'/>
        <TouchableOpacity className='z-10'>
            <View className='h-14  w-14 border border-dashed border-secondary-100 flex justify-center items-center rounded-2xl bg-white absolute top-4 right-4'>
                <MaterialIcons name="delete" size={24} color="black" />
            </View>
        </TouchableOpacity>
    </TouchableOpacity>
    </Link>
  )
}

export default ShoeCard