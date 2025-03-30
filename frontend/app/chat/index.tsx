import { View, Text, TextInput, Image, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useLocalSearchParams } from 'expo-router' // For retrieving navigation parameters
import AntDesign from '@expo/vector-icons/AntDesign';


const index = () => {

    const [input, setInput] = useState('')
    const { image } = useLocalSearchParams();
    //@ts-ignore
    const [loaded, setLoaded] = useState({
        product1: false,
        product2: false,
        product3: false,
        product4: false
    })

  return (
    <ScrollView className="flex-1"
    showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 20,
      }}
    >
    <View className='flex-1 mx-8 mt-12 flex-col'>

      <Text className='mb-8 font-interBold text-3xl text-zinc-800'>Choose Design</Text>

        <View className='flex-row justify-end'>
            {/* @ts-ignore */}
            {//<Image source={{uri: image}} resizeMethod='cover' className='absolute right-0 h-56 w-56 rounded-xl'/>
            }
            <View className='border border-black h-56 w-56 rounded-xl'></View>
        </View>

        <View className='bg-zinc-300 py-6 px-4 mr-8 w-11/2 mt-6 rounded-xl'>
            <Text className='text-black'>dasdjashjdhasdhj</Text>
            
            {loaded.product1 ? (
                null
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
                    <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
                </View>}
            {loaded.product2 ? (
                null
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {loaded.product3 ? (
                null
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
            {loaded.product4 ? (
                null
            ) : <View className='h-44 w-full flex items-center justify-center animate-pulse bg-[#141414cc] mt-4 rounded-xl'>
            <AntDesign name="loading1" size={48} color="black"  className='font-3xl animate-spin'/>
        </View>}
        
        </View>

        {/*<View className='absolute inset-x-0 bottom-10 h-16 w-full border border-zinc-300 rounded-full bg-zinc-200 flex justify-center items-center'>
            <TextInput
            className="flex-1 text-center text-black"
            placeholder="Type your message..."
            value={input}
            onChangeText={(text) => setInput(text)} // Update state on text change
            placeholderTextColor="#888"
            />
        </View>*/}
    </View>
    </ScrollView>
  )
}

export default index