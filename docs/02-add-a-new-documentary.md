# Adding a new Documentary

To add a new Documentary, do the following:

## Update Google Doc
Open the [Google Doc](https://docs.google.com/spreadsheets/d/1NcSvccw77rHAncarwfeq7RGZF7yez9mP1Icf3oLMA7g/edit) and add 
two new tabs with the following convention:
- doc-name
- doc-name-chapters

It is best to copy existing tabs.

The naming of the tabs is important!

## Update the `DEFAULT_DOC` for Preview
Edit [sheetNameFromShortId](../src/js/lib/sheetNameFromShortId.js), changing `DEFAULT_DOC` to be your new Documentary.
This matches the name of your new tab created above.

Run the app and confirm you can see the new doc appearing.

If its all ok, deploy your changes and create a Composer page.

## Update the `docsArray` after Launch
The `docsArray` in the boot template [here](../src/js/boot.js.tpl) is used to locate published Documentaries.
That is, once a Documentary has launched, you should update `docsArray` to ensure we don't fallback to `DEFAULT_DOC`.
 
Once updated, run the app and confirm you can see the new doc appearing. If its all ok, deploy your changes.

As there is a single Documentary interactive boot.js, we need a way of determining which Documentary to show.
This is determined by the path of the page and defaults to `DEFAULT_DOC`. That is, if the path of the page exists 
in `docsArray` we look at the corresponding values in the Google Sheet. If its not in `docsArray` we fallback to the `DEFAULT_DOC`. 
This allows us to preview an Documentary before publishing, but also means we can only preview one upcoming Doc at a time.
