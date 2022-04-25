import React, {useState, useEffect} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const process = {
  env: {
    userName: 'd47751abd4e8f72e',
    password:
      '9eb993127fc7bd06b21ab13995dc04435afa136d19d1fc7666113cff45701156',
    authHeader:
      'hizhdQE8OG4TYfAOaIpMlIUkidIU1O5SQJWhCfk:T2arF7wXKrooUWzYI64tw8mdjg376zmJ439CawrZ3qt3x9WHCSsJNywYw0D5XMjsbwhFCtLKVleUhLnDctvCzUCD6MQF46MA4z3qqN1iNl7evAHTjAJSPsZmAQAhdD14',
  },
};

export default function App() {
  const [recipeData, setRecipeData] = useState<{
    grocery_widget_url: string;
    delivery_partner_logos: string;
    show_widget_button: boolean;
  }>();

  // call the fetch function on mount with the id: "123"
  useEffect(() => {
    async function fetchData() {
      const response = await getRecipeData('11004', 'Widget inApp Testing');
      setRecipeData(response);
    }
    fetchData();
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
      },
      Authorization: `Basic ${process.env.authHeader}`,
      body: JSON.stringify({
        userName: process.env.userName,
        password: process.env.password,
        recipeID: id,
        recipeName: recipeName,
      }),
    };
    return await fetch('https://bon-api.com/o/token/', requestOptions).then(
      data => data.json(),
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Order recipe"
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
  },
});
