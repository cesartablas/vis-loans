# vis-loans
# Data Visualization of Prosper Loans Data

---

## Summary

**A primer on Loans:** You need to use someone else's money for a period of time. You will pay the money back, plus some "rent" called interest rate.

**Interest Rate:** Usually expressed as an annual percentage, and usually calculated on the money still owed, not on the original loan amount. The higher the interest rate, the more money you will pay back. The earliest you pay, the least interest you will pay.

**What influences the interest rate?** Your credit score: some agencies keep record of your borrowing and paying history, and calculate a score that influences what interest rate you will pay. This score relates to your likelihood of paying the debt back on time. 

This [visualization](http://cesartablas.github.io/vis-loans/) explores the relationships between the Interest Rate that a borrower has to pay on a loan, and the variables that influence this rate, like the credit score, the number of inquiries to your account made to the credit reporting agencies, your debt to income ratio, and the number of credit lines you own.

[**Explore ...**](http://cesartablas.github.io/vis-loans/)

---

## Design

The main idea behind this visualization is to plot a difuse arrangement of points simulating a cloud of points ordered by the Borrower Interest Rate in the y-axis. The x-axis serves only to spread out the points. The colors chosen resemble a cloud at dusk: a golden color, and a blue color. I obtained the full scale of 10 colors from [Color Brewer 2.0](http://colorbrewer2.org/).

I wanted the font to be thin and clear both for letters and digits. I chose Łukasz Dziedzic's [Lato](http://www.latofonts.com) font. It's interesting that Lato means 'Summer' in Polish, that makes this a summer cloud.

The main navigation is provided through "Next" and "Previous" buttons. The interaction with the variables of interest is provided by clicking on the histogram bars of the distribution of such variables. After having explored at least 3 variables, a "Wrap-Up" button is revealed to see the conclusion or "takeaway" of this visualization.

The footer contains a "dataset" button that describes the data set incrementally: every new page adds more information about the data set. The same with the "insights" button, which incrementally adds more insights, or conclusions drawn from the visualization.

After receiving feedback I made these adjustments:

* In the main text, I added a space between the description and the "punch line" (bolded text).
* Added hover effects for the boxplots.
* Eliminated the "references" button altogether, because it is a static information not relevant to the visualization.
* Changed the variable name from BorrowerAPR to Borrower Interest Rate, that is more commonly understood.
* Changed the popover trigger from the default to "focus" to avoid having overlapping descriptions.
* Changed the way the "insights" are displayed, to include all at once, highlight the current ones, and dimming the ones not yet seen.
* Added a "Wrap-Up" button to display a conclusion or inference about the visualization.

Other feedback were not followed, but were dully considered, mainly:

* Making the page responsive. It would be appropriate, but it is not the main focus of this project.
* Switching the graph to the top and the text to the bottom.
* Using the x-axis to rearrange the data according to some variable. I wanted to preserve the data as a cloud, and see the different selections as horizontal bands in the cloud, not as bars in a histogram.

---

## Feedback 

I received the following feedback on the first version of the visualization:

#####[**Bogdan:**](http://linkedin.com/in/bogdanpascalau/)

I took a look and I have some feedback!

Overall it looks great and easy to understand even without having a lot of knowledge about loans and interest rates.

I noticed the following:

- From a user design perspective when clicking the references, the popup that appears does not appear exactly above the 'references' tab but rather is right aligned to the webpage (see screenshot attached)

- the previous and next buttons are deactivated so i am not able to see the next pages, but I would make it more clear that once the person clicks 'Next', that page will talk about 'What strategies we can use to lower interest rate'; this could potentially be done by having a space between the unbolded text and the bolded question, or separating the previous and next (putting previous to the left of the page and next to the right) (see attached screenshot)

- I would define what APR means in the table

I can take a look at it again once the other pages are available! Hope this helps!
  
#####[**Daniel:**](http://linkedin.com/in/danieltablas/)
  
I’ve reviewed your graph, and here are a couple of design tweaks that could improve the readability of your information: 

- Make sure that the page is responsive, or at least scales down to a smaller size. Currently, I’m on a laptop with a standard window size, and page elements are already being shifted or moved around. 

- The hover points of the side navigation are too small which make it very hard to navigate. Also, you need to indicate what the user is hovering on by adding a colour hover effect  (alas “the dataset” and “references” buttons). 

- For “the dataset” and “references” buttons, it’s best that they close by clicking anywhere on the page rather than the actual button. That way, you can prevent tooltips overlapping each other

- I would probably move the graph right above the title, and move the question and description beneath it. That way, what’s visual comes first and before the page fold
  
I prepared the second version taking some of this feedback into consideration and posted it on Udacity's forum. I received the following feedback:

#####**Stephen:**

- What do you notice in the visualization?

> The arrangement of visual elements on the screen is nice and well organized. The presentation looks very clean and polished.
> Currently, the x-axis in the main visualization does not have a purpose, aside from spreading out the points in the visualization. Since the box plots are provided along side this plot, I don't know if readers will get much more useful information out of the jittered scatter plot than they already get out of the box plots.
> One way (suggested by @Sheng_Kung) that you could make the main plot more useful would be to plot the data points in increasing order of the point values. For example, in the plot of Borrower Interest Rate vs Credit Scores, all of the data for each credit score bucket could be plotted in order, with some space between buckets. Buckets with fewer points would naturally be more narrow than buckets with more points. This would allow the reader to get a sense of the distribution of Borrower Interest Rates, along with the total amount of data in each bucket (and you might not need the histogram in the upper right corner). The plots that pop up when a user hovers over the "dataset" button are similar to this, except that each bucket has a fixed width.

- What questions do you have about the data?

> None. I feel that the data set information is well documented with the data set button.

- What relationships do you notice?

> There are several relationships that I think are well documented in the Insights Gathered section.

- What do you think is the main takeaway from this visualization?

> This is somewhat difficult to say. There are several visualizations included here, and the insights button reveals a collection of different insights from different plots. I don't know if there is a single takeaway from the visualization that stands out among them. Is there a main takeaway that was intended for the visualization?

- Is there something you don’t understand in the graphic?

> The Insights Gathered button shows that "A shorter Term requires higher payments". Although I can can easily understand why this is true, the observation doesn't seem to have been indicated in either the visualization or the table.
> Having the insights button show all insights from previous plots can be a little confusing. When I first started looking at the plots I wasn't reading the insights too closely, and when I did start reading them closely I spent quite a while puzzling about how the first two insights were drawn from the last plot :smile: .

---

## Resources

- Tablas, César P. (2015). *Exploratory data analysis of Prosper loans.* Retrieved from [http://cesartablas.github.io/eda-loans/](http://cesartablas.github.io/eda-loans/)

- Kobliner, Beth (2012). Your credit score: The magic number explained. *Reader&#039;s Digest.* Retrieved from [http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/](http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/)

- Vaz-Oxalde, Gail E. (2012). Rule #35. Don't obsess about your credit score. *Money rules: Rule your money or your money will rule you.* Toronto, ON Canada HarperCollins Publishers.

- Colors chosen with [Color Brewer 2.0](http://colorbrewer2.org/).

- *Animated loading icon* found at [http://www.bootply.com/128062](http://www.bootply.com/128062)

- Answer to *How to invoke a "click" event programmatically using d3* found at [http://stackoverflow.com/a/11180172](http://stackoverflow.com/a/11180172)

---
