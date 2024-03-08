const Twit = require("twit");
const config = require("./config");
//https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline

// Twitter API credentials
const T = new Twit(config);

// List of Twitter accounts to scrape
const twitterAccounts = [
  "Mr_Derivatives",
  "warrior_0719",
  "ChartingProdigy",
  "allstarcharts",
  "yuriymatso",
  "TriggerTrades",
  "AdamMancini4",
  "CordovaTrades",
  "Barchart",
  "RoyLMattox",
];

// Ticker symbol to look for
const tickerToSearch = "$TSLA";

// Time interval for scraping (in milliseconds)
const scrapingIntervalMs = 15 * 60 * 1000; // 15 minutes

// Function to search for ticker symbol in tweets
const searchTickerSymbol = async () => {
  let totalMentions = 0;

  for (const account of twitterAccounts) {
    try {
      const { data: tweets } = await T.get("statuses/user_timeline", {
        screen_name: account,
        count: 100,
        tweet_mode: "extended",
      });

      for (const tweet of tweets) {
        // Convert tweet creation timestamp to milliseconds
        const tweetTime = new Date(tweet.created_at).getTime();
        // Calculate time difference in milliseconds
        const timeDiff = currentTime - tweetTime;
        // Check if the tweet was created within the last 15 minutes
        if (
          timeDiff <= scrapingIntervalMs &&
          tweet.full_text.includes(tickerToSearch)
        ) {
          totalMentions++;
        }
      }
    } catch (error) {
      console.error(`Error fetching tweets for ${account}: ${error.message}`);
      continue;
    }
  }

  console.log(
    `${tickerToSearch} was mentioned ${totalMentions} times in the last ${
      scrapingIntervalMs / (1000 * 60)
    } minutes.`
  );
};

// Perform initial search
searchTickerSymbol();

// For repeating the search every 15 minutes
setInterval(searchTickerSymbol, scrapingIntervalMs);
