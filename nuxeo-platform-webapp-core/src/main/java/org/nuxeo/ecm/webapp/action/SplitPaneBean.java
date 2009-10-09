package org.nuxeo.ecm.webapp.action;

import java.io.Serializable;

import org.apache.log4j.Logger;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;
import org.jboss.seam.annotations.remoting.WebRemote;

@Name("splitPane")
@Scope(ScopeType.SESSION)
public class SplitPaneBean implements Serializable {
    private static final Logger LOG = Logger.getLogger(SplitPaneBean.class);

    private int value;

    public SplitPaneBean() {
        LOG.info("Created SplitPaneBean");
    }

    @WebRemote
    public void setValue(String value) {
        LOG.info("Setting value : " + value);
        if (value.endsWith("px")) {
            this.value = Integer.parseInt(value.substring(0, value.length()-2));
        }
    }

    @WebRemote
    public String getValue() {
        LOG.info("Getting value : " + value);
        return String.valueOf(value);
    }

    @WebRemote
    public void addValue(String value) {
        setValue(value);
    }
}
