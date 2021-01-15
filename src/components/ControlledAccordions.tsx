import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import axios from "axios";

import { Icommit } from "../models";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "80%",
      margin: "0 auto",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    accordionDetails: {
      display: "block",
    },
  })
);

export default function ControlledAccordions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const [commitsArr, setCommitsArr] = useState<ICommit[]>([]);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const response: any = await axios.get(
          "https://api.github.com/repos/afra91/github-commit-history/commits"
        );
        const responseCommitsArr: ICommit[] = response.data.map((c) => ({
          authorName: c.commit.author.name,
          authorEmail: c.commit.author.email,
          date: new Date(c.commit.author.date),
          message: c.commit.message,
          sha: c.sha,
        }));
        setCommitsArr(responseCommitsArr);
      } catch (error) {
        throw new Error(error);
      }
    }
    fetchCommits();
  }, []);

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const accordionsList = commitsArr.map((c: ICommit, index: number) => (
    <Accordion
      expanded={expanded === `panel${index}`}
      onChange={handleChange(`panel${index}`)}
      key={c.sha}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${index}bh-content`}
        id={`panel${index}bh-header`}
      >
        <Typography className={classes.heading}>{c.sha}</Typography>
        <Typography className={classes.secondaryHeading}>
          {c.message}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Typography>
          <b>Date:</b> {c.date.toString()}
        </Typography>
        <Typography>
          <b>Author name:</b> {c.authorName}
        </Typography>
        <Typography>
          <b>Author email:</b> {c.authorEmail}
        </Typography>
      </AccordionDetails>
    </Accordion>
  ));

  return <div className={classes.root}>{accordionsList}</div>;
}
