

const grammar: string = `
    @skip poundsign {
        line ::= dimensions newline (blank | solved){10};
        dimensions ::= number 'x' number;
        solved ::= stars (spacer blank newline)?;
        blank ::= (coordinates ' ')* coordinates;
        spacer ::= ' | ';
        stars ::= coordinates ' ' coordinates;
        coordinates :: = number ',' number;
        number :: = [1-9] | '10';
        newline ::= [\\n\\r];
    }
    poundsign ::= '#' .*;
`