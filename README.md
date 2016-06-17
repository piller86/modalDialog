# modalDialog jQuery plug-in
###Simple jQuery modal dialog plug-in

See a Live Demo on [Plnkr.co](https://run.plnkr.co/plunks/wbQ4ga/)

works with jQuery 1.11.0+

Make a modal out of any element:
```
$(element).modalDialog();
```

Open/Close a modal:
```
$(element).trigger('openModal');
-------------------------------
$(element).trigger('closeModal');
```

Control how quickly*(in milliseconds)* the modal opens or closes:
```
$(element).modalDialog({slideSpeed:600});
```

Change the appearance and behavior of the modal any time you want
```
$('#modal1').modalDialog({ header: { text: 'Initial Modal Heading' } });
----------------------------------------------------------------------
1. $('#modal1').trigger('openModal');
2. $('#modal1').trigger('openModal', { header: { text: 'I changed the heading', showCloseButton: false } });
3. $('#modal1').trigger('openModal');
```
1. *This opens the modal with id="modal1" and heading will read "Initial Modal Heading"*

2. *This opens the modal with id="modal1" and changes the heading to read "I changed the heading" as well as hides the close button*

3. *This opens the modal with id="modal1" and will use the initial settings aka the heading will read "Initial Modal Heading"*

###### Update Log
```
Update 2.1
- Changed how the placement of the modal window works
- New Feature: 'offClickClose' added to allow user to click off of the modal window and automatically close the modal

Created 2.0
- New lightweight jQuery plug-in to quickly and easily integrate modal windows into any website.
```
