import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import ShoePage from '@/components/ShoePage'

const Shoe = () => {
const {id} = useLocalSearchParams()
  return (
    <>
    <View className='absolute inset-0 -z-20 bg-[rgb(42, 42, 24)]' />
    <ScrollView className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 20,
        }}
        >
        <View className='mx-8 mt-12'>
            <Text className="font-interExtraBold text-3xl text-zinc-800">Results</Text>
        
            <ShoePage shoe={{}}/>
        </View>
       
    </ScrollView>
    </>
    
  )
}

export default Shoe