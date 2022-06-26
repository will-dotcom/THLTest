Feature: MauiTest
MauiTest

  @Website
  Scenario Outline: begin search
    Given goto "<searchEngine>"
    When input for search"<skeyword>"
    Then should have a link to "<sResult>" in the returns results
    Examples: 
      | searchEngine            | skeyword | sResult                      |
      | https://www.google.com/ | Maui     | https://www.maui-rentals.com |
      | https://www.google.com/ | Britz    | https://www.britz.com        |

  @Book
  Scenario Outline: bookingstepbystep
    Given in "<weburl>" select "<destination>"
    Then select <upMonth> <upDate> <offMonth> <offDate>
    Then select "<upCity>" "<offCity>"
    Then in "<weburl>" select <adults> <children> "<driverLicense>"
    Then input promotion "<proCode>"
    Then in "<weburl>"do search should get <resultNum>
    Examples: 
      | weburl                       | destination | upMonth | upDate | offMonth | offDate | upCity       | offCity      | adults | children | driverLicense | proCode | resultNum |
      | https://www.maui-rentals.com | New Zealand | 9       | 29     | 10       | 10      | Christchurch | Christchurch | 5      | 1        | China         | Pro001  | 0         |
      | https://www.britz.com        | Australia   | 9       | 27     | 10       | 30      | Sydney       | Broome       | 2      | 1        | Australia     | Pro002  | 4         |
      | https://www.maui-rentals.com | Australia   | 12      | 19     | 12       | 30      | Sydney       | Melbourne    | 2      | 2        | Australia     | Pro003  | 6         |
      | https://www.britz.com        | New Zealand | 9       | 29     | 10       | 10      | Auckland     | Queenstown   | 2      | 1        | New Zealand   | Pro004  | 6         |