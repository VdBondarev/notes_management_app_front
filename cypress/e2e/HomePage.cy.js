describe('Home page', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should add a new note and verify its presence', () => {
        const testNoteTitle = 'TEST TITLE';
        const testNoteContent = 'TEST CONTENT';

        // Type new note title and content
        cy.get('#title').type(testNoteTitle);
        cy.get('#content').type(testNoteContent);

        // Click the 'Add a note' button
        cy.get('.add').click();

        // Verify that the new note is added and visible
        cy.contains(testNoteTitle).should('exist');
    });

    it('should find a previously added note by title', () => {
        const testNoteTitle = 'TEST TITLE';

        // Type in the search field (but only a part of it for proper searching)
        cy.get('#searchTitle').type(testNoteTitle.substring(0, 5));

        // Verify that the new note is found
        cy.contains(testNoteTitle).should('exist');

        // Clear the search field
        cy.get('#searchTitle').clear();
    });

    it('should click on a previously added note and display its content in a modal', () => {
        const testNoteTitle = 'TEST TITLE';
        const testNoteContent = 'TEST CONTENT';

        // Click on the note
        cy.contains(testNoteTitle).first().click();

        // Verify that the modal with note content is visible
        cy.get('.note-modal').should('be.visible');

        // Verify that the note content and title are displayed
        cy.contains(testNoteTitle).should('exist');
        cy.contains(testNoteContent).should('exist');

        // Close the modal
        cy.contains('Close').click();

        // Verify that the modal is closed
        cy.get('.note-modal').should('not.exist');
    });

    it('should verify that a note contains edit and delete buttons', () => {
        const testNoteTitle = 'TEST TITLE';

        // Verify that the note contains 'edit' and 'delete' buttons
        cy.contains(testNoteTitle).within(() => {
            cy.get('.edit').should('exist');
            cy.get('.delete').should('exist');
        });
    });

    it('should delete a note', () => {
        const testNoteTitle = 'TEST TITLE';

        // Delete the note
        cy.contains(testNoteTitle).first().within(() => {
            cy.get('.delete').click();
        });
    });

    it('should edit a previously added note', () => {
        const testNoteTitle = 'TEST TITLE';
        const testNoteContent = 'TEST CONTENT';
        const updatedTestNoteTitle = 'UPDATED TITLE';
        const updatedNoteContent = 'UPDATED CONTENT';

        // Add a new note to ensure it exists for editing
        cy.get('#title').type(testNoteTitle);
        cy.get('#content').type(testNoteContent);
        cy.get('.add').click();
        cy.contains(testNoteTitle).should('exist');

        // Click on the edit button for the note
        cy.contains(testNoteTitle).first().within(() => {
            cy.get('.edit').click();
        })

        // Edit the note title and content
        cy.get('#editTitle').clear().type(updatedTestNoteTitle);
        cy.get('#editContent').clear().type(updatedNoteContent);

        // Save the updated note
        cy.contains('Update').click();

        // Verify that the updated note is displayed
        cy.contains(updatedTestNoteTitle).should('exist');

        // delete the note
        cy.contains(updatedTestNoteTitle).within(() => {
            cy.get('.delete').click();
        })
    });
});
