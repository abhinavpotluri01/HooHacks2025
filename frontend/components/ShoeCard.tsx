import { View, Text, Image } from 'react-native'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from 'expo-router';


const ShoeCard = ({shoe} : {shoe : any}) => {

    const router = useRouter()

  return (
    //@ts-ignore
    <TouchableOpacity onPress={() => router.push({ pathname: `/shoe/${shoe.id}`, params: { shoe: JSON.stringify(shoe) }})} className='border mb-8 border-black h-60 rounded-2xl bg-black-100'>
        <Image source={{uri: shoe.imageURL}} resizeMethod="cover" className='h-full w-full'/>
        <TouchableOpacity className='z-10'>
            <View className='h-14  w-14 border border-dashed border-secondary-100 flex justify-center items-center rounded-2xl bg-white absolute top-4 right-4'>
                <MaterialIcons name="delete" size={24} color="black" />
            </View>
        </TouchableOpacity>
    </TouchableOpacity>

  )
}

export default ShoeCard