import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native'
import React from 'react'

const ShoePage = ({shoe} : {shoe: any}) => {

    const handleOpenLink = (url: string) => {
        if (!url) {
          Alert.alert('Error', 'No URL provided');
          return;
        }
    
        Linking.openURL(url).catch((err) => {
          console.error('Failed to open URL:', err);
          Alert.alert('Error', 'Failed to open the link');
        });
      };

  return (
    <>
    {shoe ? (
    <View className="flex-col gap-y-4 mt-4 border rounded-xl border-black px-2 py-2">
      <View className='w-full h-48 border border-black bg-zinc-300 rounded-xl'>
        <Image source={{uri: shoe.image}} resizeMode='cover' className='w-full h-full rounded-2xl'/>
        </View>
      <View>
        <Text className='text-3xl font-interExtraBold text-zinc-800'
        numberOfLines={1}
        ellipsizeMode="tail"
        >{shoe.title}</Text>
        <Text className='text-xl font-interBold text-zinc-800 mt-2'
        numberOfLines={1}
        ellipsizeMode="tail"
        >Price: {shoe.price.slice(0, -1)}</Text>
        
        <TouchableOpacity onPress={() => handleOpenLink(shoe.link)} className='w-full rounded-full border-[2px] border-black bg-black py-1.5 px-5 text-white text-center flex items-center justify-center mt-4'>
            <Text className='text-white font-interSemiBold'
            
            >
                Link
            </Text>
        </TouchableOpacity>
      </View>
    </View>) : (
        <View className="flex-col gap-y-4 mt-4 border rounded-xl border-black px-2 py-2">
        <View className='w-full h-48 border border-black bg-zinc-300 rounded-xl animate-pulse'/>
        <View>
          <View className=' text-zinc-800 w-3/5 h-12 bg-zinc-300 rounded-2xl animate-pulse'></View>
          <View className=' w-2/5 h-8 bg-zinc-300 rounded-2xl animate-pulse mt-2'></View>
          
          <View className='w-full rounded-full h-8 bg-zinc-300 py-1.5 px-5 text-white text-center flex items-center justify-center mt-2'>
          </View>
        </View>
      </View>
    )
    }
    </>
  )
}

export default ShoePage
