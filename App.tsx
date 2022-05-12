import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const process = {
  env: {
    authHeader: '344f1e6e60b59946a4429f6a4b72ea9cd1b13d64',
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [recipeData, setRecipeData] = useState<{
    grocery_widget_url: string;
    delivery_partner_logos: string;
    show_widget_button: boolean;
  }>();

  // call the fetch function on mount with the id
  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      const response = await getRecipeData('11004', 'Widget inApp Testing');
      setRecipeData(response);
    }

    fetchData();

    setLoading(false);
  }, []);

  const _handlePressButtonAsync = async () => {
    // open the link in a in-app browser
    try {
      const url = recipeData?.grocery_widget_url;
      if (url && (await InAppBrowser.isAvailable())) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#259137',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#259137',
          secondaryToolbarColor: 'black',
          navigationBarColor: 'black',
          navigationBarDividerColor: 'white',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right',
          },
        });
      } else {
        url && Linking.openURL(url);
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const getRecipeData = async (id: string, recipeName: string) => {
    // fetch the recipe data from the Bon API
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.authHeader}`,
      },
      body: JSON.stringify({
        recipe_id: id,
        recipe_name: recipeName,
      }),
    };
    return await fetch(
      'https://bon-api.com/api/v1/grocery/delivery/app/recipe-check/',
      requestOptions,
    ).then(data => data.json());
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {recipeData?.show_widget_button && (
        <Image
          source={{
            uri: recipeData?.delivery_partner_logos,
            width: 240,
            height: 120,
          }}
        />
      )}
      <Button
        title={
          recipeData?.show_widget_button
            ? 'Order recipe'
            : 'No recipe available'
        }
        // disable button if the recipe link is not available
        disabled={!recipeData?.show_widget_button}
        onPress={_handlePressButtonAsync}
        color="#259137"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
