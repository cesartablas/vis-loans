# vis-loans
# Data Visualization of Prosper Loans Data

## Summary

[This visualization](http://cesartablas.github.io/vis-loans/) explores the relationships between the Interest Rate that a borrower has to pay on a loan, and the following variables that influence this rate:
* The borrower's credit score
* The number of inquiries to their credit
* The number of current credit lines opened by the borrower
* 
*


- in no more than 4 sentences, briefly introduce your data visualization and add any context that can help readers understand it

## Design

- explain any design choices you made including changes to the visualization after collecting feedback

## Feedback

I received the following feedback on the first version of the visualization:

#####**Bogdan:**

I took a look and I have some feedback!

Overall it looks great and easy to understand even without having a lot of knowledge about loans and interest rates.

I noticed the following:

- From a user design perspective when clicking the references, the popup that appears does not appear exactly above the 'references' tab but rather is right aligned to the webpage (see screenshot attached)

- the previous and next buttons are deactivated so i am not able to see the next pages, but I would make it more clear that once the person clicks 'Next', that page will talk about 'What strategies we can use to lower interest rate'; this could potentially be done by having a space between the unbolded text and the bolded question, or separating the previous and next (putting previous to the left of the page and next to the right) (see attached screenshot)

- I would define what APR means in the table

I can take a look at it again once the other pages are available! Hope this helps!
  
#####**Daniel:**
  
I’ve reviewed your graph, and here are a couple of design tweaks that could improve the readability of your information: 

- Make sure that the page is responsive, or at least scales down to a smaller size. Currently, I’m on a laptop with a standard window size, and page elements are already being shifted or moved around. 

- The hover points of the side navigation are too small which make it very hard to navigate. Also, you need to indicate what the user is hovering on by adding a colour hover effect  (alas “the dataset” and “references” buttons). 

- For “the dataset” and “references” buttons, it’s best that they close by clicking anywhere on the page rather than the actual button. That way, you can prevent tooltips overlapping each other

- I would probably move the graph right above the title, and move the question and description beneath it. That way, what’s visual comes first and before the page fold
  
And the feedback on the second version is:

#####**Stephen:**

- What do you notice in the visualization?

The arrangement of visual elements on the screen is nice and well organized. The presentation looks very clean and polished.
Currently, the x-axis in the main visualization does not have a purpose, aside from spreading out the points in the visualization. Since the box plots are provided along side this plot, I don't know if readers will get much more useful information out of the jittered scatter plot than they already get out of the box plots.
One way (suggested by @Sheng_Kung) that you could make the main plot more useful would be to plot the data points in increasing order of the point values. For example, in the plot of Borrower Interest Rate vs Credit Scores, all of the data for each credit score bucket could be plotted in order, with some space between buckets. Buckets with fewer points would naturally be more narrow than buckets with more points. This would allow the reader to get a sense of the distribution of Borrower Interest Rates, along with the total amount of data in each bucket (and you might not need the histogram in the upper right corner). The plots that pop up when a user hovers over the "dataset" button are similar to this, except that each bucket has a fixed width.

- What questions do you have about the data?

None. I feel that the data set information is well documented with the data set button.

- What relationships do you notice?

There are several relationships that I think are well documented in the Insights Gathered section.

- What do you think is the main takeaway from this visualization?

This is somewhat difficult to say. There are several visualizations included here, and the insights button reveals a collection of different insights from different plots. I don't know if there is a single takeaway from the visualization that stands out among them. Is there a main takeaway that was intended for the visualization?

- Is there something you don’t understand in the graphic?

The Insights Gathered button shows that "A shorter Term requires higher payments". Although I can can easily understand why this is true, the observation doesn't seem to have been indicated in either the visualization or the table.
Having the insights button show all insights from previous plots can be a little confusing. When I first started looking at the plots I wasn't reading the insights too closely, and when I did start reading them closely I spent quite a while puzzling about how the first two insights were drawn from the last plot :smile: .

## Resources

- Tablas, César P. (2015). *Exploratory data analysis of Prosper loans.* Retrieved from [http://cesartablas.github.io/eda-loans/](http://cesartablas.github.io/eda-loans/)

- Kobliner, Beth (2012). Your credit score: The magic number explained. *Reader&#039;s Digest.* Retrieved from [http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/](http://www.rd.com/advice/saving-money/your-credit-score-the-magic-money-number-explained/)

- Vaz-Oxalde, Gail E. (2012). Rule #35. Don't obsess about your credit score. *Money rules: Rule your money or your money will rule you.* Toronto, ON Canada HarperCollins Publishers.

- Colors chosen with [Color Brewer 2.0](http://colorbrewer2.org/).

- *Animated loading icon* found at [http://www.bootply.com/128062](http://www.bootply.com/128062)

- Answer to *How to invoke a "click" event programmatically using d3* found at [http://stackoverflow.com/a/11180172](http://stackoverflow.com/a/11180172)
